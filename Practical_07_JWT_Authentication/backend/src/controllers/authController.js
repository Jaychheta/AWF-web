const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '1h' }
  );
}

/** POST /api/auth/register */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'An account with this email already exists'
      });
    }
    const user = await User.create({ name: name.trim(), email: email.trim(), password });
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: signToken(user),
      user: user.toSafeJSON()
    });
  } catch (err) {
    return next(err);
  }
}

/** POST /api/auth/login */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }
    return res.json({ success: true, message: 'Login successful', token: signToken(user), user: user.toSafeJSON() });
  } catch (err) {
    return next(err);
  }
}

/** GET /api/auth/me (protected) */
async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    return res.json({ success: true, user: user.toSafeJSON() });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, me };
