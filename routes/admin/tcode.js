const express = require('express');
const router = express.Router();
const tcodeController = require('../../controllers/admin/tcodeController');

router.get('/', tcodeController.index);
router.post('/', tcodeController.create);

// router.get('/:id/edit', tcodeController.editForm);
router.post('/:id', tcodeController.update);

router.post('/:id/delete', tcodeController.delete);
router.get('/print', tcodeController.print);



module.exports = router;
