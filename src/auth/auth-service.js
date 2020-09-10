const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {
  getAllUsers(db) {
    return db.from('colorgame_users');
  },
  getUserByUserName(db, username) {
    return db
      .from('colorgame_users')
      .where({username: username})
      .first();
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_CODE, {
      subject,
      algorithm: 'HS256'
    });
  },
  verifyJwt(token) {
    return jwt.verify(token, config.JWT_CODE, {
      algorithms: ['HS256']
    });
  }
};

module.exports = AuthService;