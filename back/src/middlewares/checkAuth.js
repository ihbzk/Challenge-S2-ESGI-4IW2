const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const dotenv = require('dotenv').config({ path: './.env.local' });
const blacklistedTokens = require('./blacklistedTokens');

module.exports = async function checkAuth(req, res, next) {
    const header = req.headers.Authorization || req.headers.authorization;
    if (!header) {
        return res.sendStatus(401);
    }

    const [type, token] = header.split(/\s+/);
    

    if (type !== 'Bearer') {
        return res.sendStatus(401);
    }

    // Vérifier si le token est dans la blacklist
    if (blacklistedTokens.has(token)) {
        return res.sendStatus(403);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        req.user = user;
        next();
    } catch (error) {
        console.error('Erreur d\'authentification :', error);
        return res.sendStatus(401);
    }
};
