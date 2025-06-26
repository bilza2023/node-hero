const { verifyToken } = require('../config/jwt');

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).send('Access token required');
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).send('Invalid or expired token');
  }

  req.user = decoded;
  next();
}

module.exports = authenticate;
