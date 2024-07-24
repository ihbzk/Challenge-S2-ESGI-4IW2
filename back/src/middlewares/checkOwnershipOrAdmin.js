const checkOwnershipOrAdmin = (req, res, next) => {
    const userId = req.params.id || req.params.userId;
    const currentUser = req.user;
  
    // vérifiez si l'utilisateur actuel est défini
    if (!currentUser) {
      return res.status(401);
    }
  
    // si l'utilisateur actuel correspond bien au compte utilisateur ou est administrateur
    if (currentUser.id.toString() === userId || currentUser.role === 'ROLE_ADMIN') {
      return next();
    }
  
    // si l'utilisateur n'est ni administrateur ni le propriétaire du compte, retournez une erreur 403
    return res.status(403);
  };
  
  module.exports = checkOwnershipOrAdmin;
  