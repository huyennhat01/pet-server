const authPage = (permission) => {
  return (req, res, next) => {
    const role = req.user.sub.role;
    if (!role) {
      return res.status(403).json("You need sign in!");
    }
    if (!permission.includes(role)) {
      return res.status(401).json("You don't have permission!");
    }
    next();
  };
};

module.exports = { authPage };
