module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL || 'postgresql://dunder_mifflin@localhost/color-game',
    JWT_CODE: process.env.JWT_CODE || 'change-this'
  }