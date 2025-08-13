const jwt = require("jsonwebtoken");

const authenticateAdmin = (req, res, next) => {
  // console.log("Request Headers:", req.headers);
  // console.log("Request Cookies:", req.cookies);

  // Try to get token from Authorization header first (Bearer token)
  let token = req.headers.authorization?.split(" ")[1];

  // If no token in header, try to get from 'admin' cookie
  if (!token) {
    token = req.cookies?.admin;
  }

  if (!token) {
    console.log("No token provided in header or admin cookie");
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  // console.log("Token received:", token);

  try {
    // Verify token using the admin JWT secret
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET || 'sgjjvgvytfr67t87yughjvghgs');
    // console.log("Token decoded successfully:", decoded);

    // Attach decoded info to req.admin
    req.admin = decoded;
    next();
  } catch (err) {
    // console.log("Token verification failed:", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = authenticateAdmin;
