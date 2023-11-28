const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    next();
  };
};

module.exports = authorize;
