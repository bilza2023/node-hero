const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/exerciseController');

router.get('/', controller.index);                     // /admin/exercise?tcode=...&chapter=...
router.post('/create', controller.create);             // POST create exercise
router.post('/:id', controller.update);                // POST update exercise
router.post('/:id/delete', controller.delete);         // POST delete exercise

module.exports = router;
 