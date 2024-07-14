module.exports = ({ role: [] }) => async (req, res, next) => {
    try {
        if (!req.user) {
            return res.sendStatus(401);
        }
        
        if (!req.user) {
            return res.sendStatus(401);
        }

        if (!role.includes(req.user.role)) {
            return res.sendStatus(403);
        }
        
        next();
    } catch (error) {
        console.error('Erreur lors de la vérification du rôle :', error);
        return res.status(500).json({ message: error.message });
    }
}