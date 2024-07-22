const { Sequelize, DataTypes, Model } = require('sequelize');
const dotenv = require('dotenv').config({ path: './.env.local' });
const moment = require('moment');
require('moment/locale/fr');
moment.locale('fr');

const sequelize = new Sequelize(process.env.POSTGRES_URI);

// Définition de la classe User
class User extends Model {
    isLocked() {
        return this.lockUntil && moment(this.lockUntil).format('YYYY-MM-DD HH:mm:ss') > moment.tz('Europe/Paris').format('YYYY-MM-DD HH:mm:ss');
    }

    async incrementLoginAttempts() {
        if (this.lockUntil && moment(this.lockUntil).format('YYYY-MM-DD HH:mm:ss') < moment.tz('Europe/Paris').format('YYYY-MM-DD HH:mm:ss')) {
            await this.update({ loginAttempts: 1, lockUntil: null });
            
            return;
        }

        const updates = { loginAttempts: this.loginAttempts + 1 };
        if (this.loginAttempts + 1 >= 3 && !this.isLocked()) {
            const lockTime = parseInt(process.env.LOCK_TIME);
            updates.lockUntil = moment.tz('Europe/Paris').add(lockTime, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        }

        await this.update(updates);
    }

    async anonymize() {
        await this.update({
            firstname: 'Anonymized',
            lastname: 'User',
            email: `anonymized_${this.id}@example.com`,
            password: null,
            role: 'ROLE_USER',
            isConfirmed: false,
            loginAttempts: 0,
            lockUntil: null,
            resetPasswordToken: null,
            resetPasswordExpires: null,
            confirmationToken: null,
            lastPasswordModificationDate: null,
        });
    }
}

// Définition du modèle User
User.init({
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'ROLE_USER',
        validate: {
            isIn: [['ROLE_USER', 'ROLE_STORE_KEEPER', 'ROLE_COMPTA', 'ROLE_ADMIN']]
        }
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: "L'adresse email est déjà utilisée"
        },
        validate: {
            isEmail: {
                msg: "Le format de l'adresse email est invalide"
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,      
        validate: {
            len: {
                args: [12],
                msg: 'Le mot de passe doit contenir au moins 12 caractères'
            },
            is: {
                args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/,
                msg: 'Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial'
            }
        }
    },
    lastPasswordModificationDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    isConfirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    loginAttempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    lockUntil: {
        type: DataTypes.DATE,
        allowNull: true
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    confirmationToken: Sequelize.STRING
    }, {
    sequelize,
    modelName: 'User',
});

// Synchronisation du modèle avec la base de données
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL database successful');

        await sequelize.sync();
        console.log('Database synchronized');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = User;
