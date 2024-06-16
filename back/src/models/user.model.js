const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config({ path: './.env.local' });
const moment = require('moment');

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['ROLE_USER', 'ROLE_STORE_KEEPER', 'ROLE_ADMIN'],
        default: 'ROLE_USER'
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'L\'adresse email est requise'],
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Le format de l\'adresse email est invalide'],
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [12, 'Le mot de passe doit contenir au moins 12 caractères'],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/, 'Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial'],
    },
    lastPasswordModificationDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isConfirmed: {
        type: Boolean,
        required: true,
        default: false
    },
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Date },
    authTokens: [{
        authToken: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true
        }
    }]
});

userSchema.plugin(uniqueValidator, { message: 'L\'email est déjà utilisé' });

userSchema.methods.generateAuthToken = async function () {
    const authToken = jwt.sign({ _id: this._id }, "" + process.env.JWT_SECRET, { expiresIn: '1h' });
    const expiresAt = moment().add(1, 'hour').toDate();

    // Filtrer et supprimer les tokens expirés avant d'ajouter le nouveau token
    this.authTokens = this.authTokens.filter(tokenObj => moment(tokenObj.expiresAt).isAfter(moment()));
    this.authTokens.push({ authToken, expiresAt });

    await this.save();
    return authToken;
};

userSchema.methods.isLocked = function() {
    return this.lockUntil && this.lockUntil > Date.now();
};
  
userSchema.methods.incrementLoginAttempts = function(callback) {
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
        $set: { loginAttempts: 1 },
        $unset: { lockUntil: 1 }
        }, callback);
    }
    
    const updates = { $inc: { loginAttempts: 1 } };
    if (this.loginAttempts + 1 >= 3 && !this.isLocked()) {
        updates.$set = { lockUntil: Date.now() + 20 * 60 * 1000 }; // 20 minutes
    }

    return this.updateOne(updates, callback);
};


const user = mongoose.model('User', userSchema);

module.exports = user;

