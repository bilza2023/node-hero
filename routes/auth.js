const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const authenticate = require('../middleware/auth');

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/whoami', authenticate, (req, res) => {
  res.json({
    email: req.user.email,
    id: req.user.id,
    role: req.user.role || 'user', // optional if roles are removed
    time: new Date().toISOString()
  });
});

router.post('/login', login);

module.exports = router;
