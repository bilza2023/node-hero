const prisma = require('../db');

async function createTcode(data) {
  return prisma.tcode.create({ data });
}

async function getAllTcodes() {
  return prisma.tcode.findMany();
}

async function getTcodeById(id) {
  return prisma.tcode.findUnique({ where: { id } });
}

async function updateTcode(id, data) {
  return prisma.tcode.update({ where: { id }, data });
}

async function deleteTcode(id) {
  return prisma.tcode.delete({ where: { id } });
}

module.exports = {
  createTcode,
  getAllTcodes,
  getTcodeById,
  updateTcode,
  deleteTcode,
};
