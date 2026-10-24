const jwt = require('jsonwebtoken');

/**
 * Authentication middleware: expects "Authorization: Bearer <token>",
 * verifies the JWT and attaches the decoded payload to req.user.
 */
function protect(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authenticated',
      message: 'No token supplied in the Authorization header'
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch (err) {
    const reason = err.name === 'TokenExpiredError' ? 'Token has expired' : 'Token is not valid';
    return res.status(401).json({ success: false, error: 'Not authenticated', message: reason });
  }
}

module.exports = { protect };
