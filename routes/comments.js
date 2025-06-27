const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/comments', async (req, res) => {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.render('comments', { comments });
});

router.post('/comments', async (req, res) => {
  const message = req.body.message?.trim();
  if (message) {
    await prisma.comment.create({ data: { message } });
  }
  res.redirect('/comments');
});

module.exports = router;
