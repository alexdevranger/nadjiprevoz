export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: "Pristup zabranjen" });
    }

    const hasRole = req.user.roles.some((role) => roles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: "Nemate dozvolu" });
    }

    next();
  };
};
