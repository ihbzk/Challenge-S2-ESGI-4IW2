const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config({ path: './.env.local' });
const { sendMail } = require('../services/emailService');
const moment = require('moment');

// Route pour la connexion
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // Vérifier si l'utilisateur existe
        if (!user) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // Vérifier si le mot de passe est correct, sinon incrémenter le nombre de tentatives de connexion
        if (!bcrypt.compareSync(password, user.password)) {
            await user.incrementLoginAttempts();
            if (user.loginAttempts + 1 >= 3 && !user.isLocked()) {
                await sendLockNotification(user);
            }
            
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // Vérifier si le compte est verrouillé
        if (user.isLocked()) {
            return res.status(403).json({ message: 'Compte verrouillé, veuillez réessayer dans 20 minutes' });
        }

        // Vérifier si le compte est confirmé
        if (!user.isConfirmed) {
            return res.status(401).json({ message: 'Compte non confirmé, veuillez vérifier votre e-mail' });
        }

        // Vérification de la date de dernière modification du mot de passe
        const lastChangeDate = user.lastPasswordModificationDate || user.createdAt;
        const daysSinceLastChange = moment().diff(moment(lastChangeDate), 'days');

        if (daysSinceLastChange >= 60) {
            const context = {
                firstname: user.firstname,
                renewalUrl: `http://${process.env.HOST}:${process.env.PORT_FRONTEND}/reset-password?email=${user.email}`,
            };
        
            try {
                await sendMail({
                    from: user.email,
                    to: user.email,
                    subject: 'Renouvellement de mot de passe',
                    text: `Bonjour ${user.firstname},\n\nIl est temps de renouveler votre mot de passe. Veuillez cliquer sur le lien suivant pour renouveler votre mot de passe :\n\n${context.renewalUrl}\n\nMerci !`,
                    template: 'renewalPassword',
                    context,
                });
                console.log(`Renouvellement de mot de passe envoyé à ${user.email}`);
            } catch (error) {
                console.error(`Erreur d'envoi de renouvellement de mot de passe à ${user.email}:`, error);
            }
        }

        // Réinitialiser les tentatives de connexion en cas de succès
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        await user.save();

        // Générer le token d'authentification
        const authToken = await user.generateAuthToken();

        // Retourner les données de l'utilisateur avec le token
        return res.status(200).json({ user, authToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const context = {
            firstname: user.firstname,
            resetPasswordUrl: `http://${"" + process.env.HOST}:${"" + process.env.PORT_FRONTEND}/reset-password?email=${email}`,
        };

        // Send password reset email
        sendMail({
            from: email,
            to: email,
            subject: 'Réinitialisation du mot de passe',
            text: `Bonjour ${user.firstname},\n\nVous avez demandé une réinitialisation de votre mot de passe. Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe :\n\nhttp://${"" + process.env.HOST}:${"" + process.env.PORT_FRONTEND}/reset-password?email=${email}\n\nMerci !`,
            template: 'resetPassword',
            context,
        });

        res.status(200).json({ message: 'Password reset email sent' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fonction pour envoyer un e-mail de notification de verrouillage
async function sendLockNotification(user) {
    const subject = 'Votre compte a été verrouillé après plusieurs tentatives de connexion infructueuses';
    const context = {
      firstname: user.firstname,
      lockDuration: '20 minutes'
    };
  
    await sendMail({
      to: user.email,
      subject,
      template: 'accountLocked',
      context
    });
}

// Route pour l'inscription
exports.register = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        
        const newUser = new User({ 
            firstname, 
            lastname, 
            email, 
            password, 
            role: 'ROLE_USER', 
            isConfirmed: false, 
            createdAt: new Date(),
            updatedAt: '',
            lastPasswordModificationDate: '',
        });

        // Valider l'utilisateur avant de hacher le mot de passe
        await newUser.validate();

        // Hacher le mot de passe après la validation
        newUser.password = bcrypt.hashSync(password, 10);

        await newUser.save();

        const context = {
            firstname,
            confirmationUrl: `http://${"" + process.env.HOST}:${"" + process.env.PORT_BACKEND}/confirm?email=${email}`,
        }

        // Envoi d'un e-mail de confirmation
        sendMail({
            from: email,
            to: email, 
            subject: 'Confirmation de votre inscription',
            text: `Bonjour ${firstname},\n\nMerci de vous être inscrit. Veuillez confirmer votre inscription en cliquant sur le lien suivant :\n\nhttp://${"" + process.env.HOST}:${"" + process.env.PORT_BACKEND}/confirm?email=${email}\n\nMerci !`,
            template: 'confirmation',
            context,
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // on crée un nouvel utilisateur temporaire pour valider le nouveau mot de passe
        const tempUser = new User({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            password: password, // nouveau mot de passe
            role: user.role,
            isConfirmed: user.isConfirmed,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            lastPasswordModificationDate: user.lastPasswordModificationDate,
        });

        // Valider le nouvel utilisateur avant de hacher le mot de passe
        const validationError = tempUser.validateSync();

        if (validationError && validationError.errors && validationError.errors.password) {
            return res.status(400).json({ message: validationError.errors.password.message });
        }

        // on hache le nouveau mot de passe
        user.password = bcrypt.hashSync(password, 10);
        user.lastPasswordModificationDate = new Date();

        await user.save();

        res.status(200).json({ message: 'Password updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Route pour la confirmation d'inscription
exports.confirm = (async (req, res) => {
    try {
        const { email } = req.query;

        // Vérifier si l'utilisateur avec cet e-mail existe
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Mettre à jour l'état isConfirmed de l'utilisateur
        user.isConfirmed = true;
        await user.save();

        // Rediriger ou afficher une confirmation
        res.status(200).json({ message: 'Confirmation réussie' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route pour récupérer l'ensemble des utilisateurs
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({});

        res.send(users);
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
};


// Route pour récupérer un utilisateur
exports.me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // req.user est défini dans le middleware d'authentification

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Retourner les données de l'utilisateur
        res.status(200).json({
            user: {
                id: user.id,
                firstname: user.firstname,
                email: user.email,
                isConfirmed: user.isConfirmed
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Route pour la déconnexion
exports.logout = async (req, res) => {
    try {
        req.user.authTokens = req.user.authTokens.filter((authToken) => {
            return authToken.authToken !== req.authToken;
        });

        await req.user.save();
        res.send({ message: 'Logged out' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Route pour la déconnexion de tous les appareils
exports.logoutAll = async (req, res) => {
    try {
        req.user.authTokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

