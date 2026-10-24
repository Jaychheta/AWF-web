const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function reject(res, details) {
  return res.status(400).json({
    success: false,
    error: 'Validation Error',
    message: 'The request payload failed validation',
    details
  });
}

/** Server-side validation for POST /api/auth/register */
function validateRegister(req, res, next) {
  const { name, email, password } = req.body || {};
  const details = [];
  if (typeof name !== 'string' || name.trim().length < 2) details.push('name must be a string of at least 2 characters');
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) details.push('email must be a valid email address');
  if (typeof password !== 'string' || password.length < 6) details.push('password must be at least 6 characters long');
  if (details.length) return reject(res, details);
  next();
}

/** Server-side validation for POST /api/auth/login */
function validateLogin(req, res, next) {
  const { email, password } = req.body || {};
  const details = [];
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) details.push('email must be a valid email address');
  if (typeof password !== 'string' || password.length === 0) details.push('password is required');
  if (details.length) return reject(res, details);
  next();
}

/** Server-side validation for POST /api/tasks */
function validateTask(req, res, next) {
  const { title } = req.body || {};
  const details = [];
  if (typeof title !== 'string' || title.trim().length < 3) details.push('title must be a string of at least 3 characters');
  if (details.length) return reject(res, details);
  next();
}

module.exports = { validateRegister, validateLogin, validateTask };
