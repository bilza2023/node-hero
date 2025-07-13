
// /routes/player.js
const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.get('/', playerController.showPlayer);

module.exports = router;
