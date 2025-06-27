const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(pw) {
  return pw.length >= 6 && !/\s/.test(pw);
}

async function main() {
  let email = '';
  while (!isValidEmail(email)) {
    email = await ask("Email: ");
    if (!isValidEmail(email)) console.log("❌ Invalid email format.");
  }

  let plain = '';
  while (!isValidPassword(plain)) {
    plain = await ask("Password (min 6 chars, no spaces): ");
    if (!isValidPassword(plain)) console.log("❌ Invalid password.");
  }

  const validRoles = ['admin', 'user'];
  let role = '';
  while (!validRoles.includes(role)) {
    role = await ask("Role (admin/user): ");
    if (!validRoles.includes(role)) console.log("❌ Invalid role. Use: admin or user.");
  }

  const password = bcrypt.hashSync(plain, 10);

  await prisma.user.create({
    data: { email, password, role }
  });

  console.log("✅ User created");
  rl.close();
  await prisma.$disconnect();
}

main();
