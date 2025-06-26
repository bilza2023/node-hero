const AccessControl = require('accesscontrol');

const ac = new AccessControl();

ac.grant('user')
  .createOwn('file')
  .createOwn('image');

ac.grant('admin')
  .extend('user')
  .readAny('file')
  .readAny('image')
  .deleteAny('file');

module.exports = ac;
