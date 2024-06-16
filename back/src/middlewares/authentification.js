const jwt = require('jsonwebtoken');
const moment = require('moment');
const User = require('../models/user.model');
const dotenv = require('dotenv').config({ path: './.env.local' });

const authentification = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, "" + process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'authTokens.authToken': token });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Purge expired tokens
        const now = moment();
        user.authTokens = user.authTokens.filter(tokenObj => moment(tokenObj.expiresAt).isAfter(now));
        await user.save();

        // Check if the provided token is still valid
        const validToken = user.authTokens.find(tokenObj => tokenObj.authToken === token);
        if (!validToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        req.authToken = token;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authentification;
