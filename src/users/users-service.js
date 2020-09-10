const bcrypt = require('bcryptjs');

const UsersService = {
  getUserById(db, id) {
    return db('colorgame_users')
      .where({id})
      .first()
  },
  hasUserWithUserName(db, username) {
    return db('colorgame_users')
      .where({ username })
      .first()
      .then(user => !!user);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('colorgame_users')
      .returning('*')
      .then(([user]) => user);
  },
  deleteUser(db, id) {
    return db('colorgame_users')
      .where({id})
      .delete();
  },
  updateUser(db, id, newUser) {
    return db('colorgame_users')
      .where({ id })
      .update(newUser)
  },
  updateBlog(db, id, newBlog) {
    return db('colorgame_users')
      .where({id})
      .update('blogpost', newBlog)
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start with empty spaces'
    }
  },
}

module.exports = UsersService