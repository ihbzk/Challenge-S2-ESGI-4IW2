const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config({ path: "./.env.local" });
const { sendMail } = require("../services/emailService");

// utiliser moment pour gérer les dates
const moment = require("moment");
require("moment/locale/fr");
moment.locale("fr");

const jwt = require("jsonwebtoken");
const blacklistedTokens = require("../middlewares/blacklistedTokens");
const crypto = require("crypto");

// Route pour la connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Vérifier si le mot de passe est correct, sinon incrémenter le nombre de tentatives de connexion
    if (!bcrypt.compareSync(password, user.password)) {
      await user.incrementLoginAttempts();

      if (user.loginAttempts + 1 >= 3 && !user.isLocked()) {
        await sendLockNotification(user);
      }

      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Vérifier si le compte est verrouillé
    if (user.isLocked()) {
      return res
        .status(403)
        .json({
          message: `Compte verrouillé, veuillez réessayer ${moment(
            user.lockUntil
          )
            .add(-2, "hours")
            .fromNow()}`,
        });
    }

    // Vérifier si le compte est confirmé
    if (!user.isConfirmed) {
      return res
        .status(401)
        .json({
          message: "Compte non confirmé, veuillez vérifier votre e-mail",
        });
    }

    // Vérification de la date de dernière modification du mot de passe
    const lastChangeDate = user.lastPasswordModificationDate || user.createdAt;
    const daysSinceLastChange = moment().diff(moment(lastChangeDate), "days");

    if (daysSinceLastChange >= 60) {
      // Générer un token de réinitialisation
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      const resetTokenExpiry = moment
        .tz("Europe/Paris")
        .add(1, "hour")
        .format("YYYY-MM-DD HH:mm:ss");

      // Stocker le token haché et son expiration dans la base de données
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = resetTokenExpiry;

      await user.save();

      const context = {
        firstname: user.firstname,
        renewalUrl: `${process.env.FRONTEND_URL}/reset-password?token=${hashedToken}`,
      };

      try {
        await sendMail({
          from: user.email,
          to: user.email,
          subject: "Renouvellement de mot de passe",
          text: `Bonjour ${user.firstname},\n\nIl est temps de renouveler votre mot de passe. Veuillez cliquer sur le lien suivant pour renouveler votre mot de passe :\n\n${context.renewalUrl}\n\nMerci !`,
          template: "renewalPassword",
          context,
        });
        console.log(`Renouvellement de mot de passe envoyé à ${user.email}`);
      } catch (error) {
        console.error(
          `Erreur d'envoi de renouvellement de mot de passe à ${user.email}:`,
          error
        );
      }
    }

    // Réinitialiser les tentatives de connexion en cas de succès
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Générer le token d'authentification
    const expiresIn = process.env.JWT_EXPIRES_IN || "1h";
    const authToken = jwt.sign({ id: user.id }, "" + process.env.JWT_SECRET, {
      expiresIn: expiresIn,
    });

    // Retourner les données de l'utilisateur avec le token
    res.status(200).json({ authToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.sendStatus(404);
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetTokenExpiry = moment
      .tz("Europe/Paris")
      .add(1, "hour")
      .format("YYYY-MM-DD HH:mm:ss");

    // Stocker le token haché et son expiration dans la base de données
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const context = {
      firstname: user.firstname,
      resetPasswordUrl: `${process.env.FRONTEND_URL}/reset-password?token=${hashedToken}`,
    };

    // Envoyer l'email de réinitialisation de mot de passe
    await sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Réinitialisation du mot de passe",
      text: `Bonjour ${user.firstname},\n\nVous avez demandé une réinitialisation de votre mot de passe. Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe :\n\n${context.resetPasswordUrl}\n\nMerci !`,
      template: "resetPassword",
      context,
    });

    res
      .status(200)
      .json({ message: "Email de réinitialisation de mot de passe envoyé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token de réinitialisation invalide ou expiré" });
    }

    // Mettre à jour le mot de passe de l'utilisateur
    user.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.lastPasswordModificationDate = moment
      .tz("Europe/Paris")
      .format("YYYY-MM-DD HH:mm:ss");
    // user.updatedAt = moment.tz('Europe/Paris').format('YYYY-MM-DD HH:mm:ss');

    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPasswordVerifyToken = async (req, res) => {
  try {
    const { token } = req.query;

    // Vérifier si l'utilisateur avec ce token existe
    const user = await User.findOne({ where: { resetPasswordToken: token } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Lien de confirmation invalide ou expiré" });
    }

    // -1 correspond à l'heure qui vient de passer
    if (moment().diff(moment(user.resetPasswordExpires), "hours") >= -1) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await user.save();

      return res
        .status(404)
        .json({ message: "Lien de confirmation invalide ou expiré" });
    }

    res.status(200).json({ message: "Lien de confirmation valide" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fonction pour envoyer un e-mail de notification de verrouillage
async function sendLockNotification(user) {
  const subject =
    "Votre compte a été verrouillé après plusieurs tentatives de connexion infructueuses";
  const context = {
    firstname: user.firstname,
    lockDuration: process.env.LOCK_TIME_MESSAGE,
  };

  await sendMail({
    to: user.email,
    subject,
    template: "accountLocked",
    context,
  });
}

// Route pour l'inscription
exports.register = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    let existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "L'adresse email est déjà utilisée" });
    }

    // Générer un token de confirmation unique
    const confirmationToken = crypto.randomBytes(20).toString("hex");

    // Créer l'utilisateur sans hacher le mot de passe
    let newUser = User.build({
      firstname,
      lastname,
      email,
      password: password, // Ne pas hacher ici
      role: "ROLE_USER",
      isConfirmed: false,
      confirmationToken,
      createdAt: moment.tz("Europe/Paris").format("YYYY-MM-DD HH:mm:ss"),
    });

    // Valider l'utilisateur
    await newUser.validate();

    // Hacher le mot de passe
    newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    // Enregistrer l'utilisateur avec le mot de passe haché
    await newUser.save();

    // Envoyer l'email de confirmation avec le token
    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm?token=${confirmationToken}`;
    await sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Confirmation de votre inscription",
      text: `Bonjour ${firstname},\n\nMerci de vous être inscrit. Veuillez confirmer votre inscription en cliquant sur ce lien :\n\n${confirmationUrl}\n\nMerci !`,
      template: "confirmation",
      context: { firstname, confirmationUrl },
    });

    res.status(201).json({
      message:
        "Inscription réussit avec succès. Veuillez vérifier votre email pour confirmer votre inscription.",
      verificationRequired: true,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // Construction d'un objet d'erreurs pour renvoyer des détails spécifiques à l'utilisateur
      const errors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));

      // Réponse avec les erreurs de validation
      res.status(400).json({ errors });
    } else {
      // Autres erreurs internes du serveur
      console.error("Erreur lors de l'inscription:", error);
      res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
  }
};

exports.confirmVerifyToken = async (req, res) => {
  try {
    const { token } = req.query;

    // Vérifier si l'utilisateur avec ce token existe
    const user = await User.findOne({ where: { confirmationToken: token } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Lien de confirmation invalide ou expiré" });
    }

    res.status(200).json({ message: "Lien de confirmation valide" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route pour la confirmation d'inscription
exports.confirm = async (req, res) => {
  try {
    const { token } = req.query;

    // Vérifier si l'utilisateur avec ce token existe
    const user = await User.findOne({ where: { confirmationToken: token } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Lien de confirmation invalide ou expiré" });
    }

    // Mettre à jour l'état isConfirmed de l'utilisateur et effacer le token de confirmation
    user.isConfirmed = true;
    user.confirmationToken = null;
    await user.save();

    // Rediriger ou afficher une confirmation
    res.status(200).json({ message: "Confirmation réussie" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route pour récupérer l'ensemble des utilisateurs
exports.readUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    res.send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    let existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "L'adresse email est déjà utilisée" });
    }

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password,
      role,
    });

    newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    await newUser.save();

    res.status(201);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404);
    }

    await user.anonymize();

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404);
    }

    const { firstname, lastname, email, password, role } = req.body;

    // si l'utilisateur est administrateur, il peut modifier le rôle de l'utilisateur sinon il garde son role
    if (req.user.role === "ROLE_ADMIN") {
      selectedRole = role;
    } else {
      selectedRole = user.role;
    }

    // on hache le mot de passe si un nouveau mot de passe est fourni
    let hashedPassword = user.password;
    if (password) {
      hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    await User.update(
      {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        role: selectedRole
      },
      {
        where: { id },
      }
    );

    const updatedUser = await User.findByPk(id);

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Route pour récupérer un utilisateur
exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.sendStatus(404);
    }

    const token = req.headers.authorization.split(" ")[1];

    if (blacklistedTokens.has(token)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Retourner les données de l'utilisateur
    res.status(200).json({
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    res.status(500).json({ message: error.message });
  }
};

// Déconnexion de l'utilisateur
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (token) {
      blacklistedTokens.add(token);
    }
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// vérifier si l'utilisateur est administrateur
exports.isAdministrator = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.sendStatus(404);
    }

    if (user.role !== "ROLE_ADMIN") {
      return res.sendStatus(403); // Forbidden
    }

    next();
  } catch (error) {
    console.error("Error checking administrator role", error);
    res.sendStatus(500); // Internal Server Error
  }
};
