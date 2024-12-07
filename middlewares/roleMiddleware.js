const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (!role || !allowedRoles.includes(role)) {
      return res
        .status(403)
        .json({ message: "Access forbidden: Insufficient permissions" });
    }

    next();
  };
};

module.exports = roleMiddleware;
