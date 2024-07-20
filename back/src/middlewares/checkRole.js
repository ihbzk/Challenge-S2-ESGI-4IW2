// middlewares/checkRole.js
module.exports = ({ roles = [] }) => async (req, res, next) => {
    try {
        if (!req.user) {
            return res.sendStatus(401); // Unauthorized
        }

        if (!roles.includes(req.user.role)) {
            return res.sendStatus(403); // Forbidden
        }
        
        next();
    } catch (error) {
        console.error('Erreur lors de la vérification du rôle :', error);
        return res.status(500).json({ message: error.message });
    }
};
