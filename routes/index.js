const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('home.njk', { title: 'Welcome to Node Hero' });
});

module.exports = router;
