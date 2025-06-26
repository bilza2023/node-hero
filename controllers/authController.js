const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { signToken } = require('../config/jwt');

const usersPath = path.join(__dirname, '../data/users.json');

function login(req, res) {
  const { email, password } = req.body;

  const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  const user = users.find(u => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).send('Invalid email or password');
  }

  const token = signToken(user);
  res.json({ token });
}

module.exports = { login };
