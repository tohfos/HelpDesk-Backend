const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthoried" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = decoded.UserInfo.username;
    req.role = decoded.UserInfo.role;
    req.userId = decoded.UserInfo.userid;
    req.email = decoded.UserInfo.email;
    req.phone = decoded.UserInfo.phone;
    req.firstname = decoded.UserInfo.firstname;
    req.lastname = decoded.UserInfo.lastname;
    next();
  });
};



module.exports = authenticate;
