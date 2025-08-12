// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ message: 'Token required' });

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // { id, email }
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: 'Invalid token' });
//   }
// };
const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  // console.log(" Request Headers:", req.headers);
  // console.log("Request Cookies:", req.cookies);

  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    token = req.cookies?.token;
  }

  if (!token) {
    console.log(" No token provided in header or cookie");
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  // console.log("Token received:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(" Token decoded successfully:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    // console.log("Token verification failed:", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = authenticateUser;
