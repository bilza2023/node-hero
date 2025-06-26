const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const usersPath = path.join(__dirname, '../data/users.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Email: ', email => {
  rl.question('Password: ', password => {
    rl.question('Role (admin/user): ', role => {
      const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
      const hashedPassword = bcrypt.hashSync(password, 10);

      const newUser = {
        id: `u${users.length + 1}`.padStart(4, '0'),
        email,
        password: hashedPassword,
        role
      };

      users.push(newUser);
      fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
      console.log(`User ${email} added.`);
      rl.close();
    });
  });
});
