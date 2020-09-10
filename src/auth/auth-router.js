const express = require('express');
const AuthService = require('./auth-service');

const authRouter = express.Router();
const jsonBodyParser = express.json();

//post login
authRouter.post('/login', jsonBodyParser, (req, res, next) => {
  const { username, password } = req.body;
  const loginUser = { username, password };

  //Check for password and username
  for (const [key, value] of Object.entries(loginUser)) {
    if (value == null) {
      return res.status(400).json({
        error: `Missing '${key}' in request`
      });
    }
  }

  //Find username
  AuthService.getUserByUserName(req.app.get('db'), loginUser.username)
    .then(user => {
      if (!user) {
        return res.status(400).json({
          error: 'Incorrect username or password'
        });
      }

      //Check password if user is found
      return AuthService.comparePasswords(loginUser.password, user.password)
        .then(match => {
          if (!match) {
            return res.status(400).json({
              error: 'Incorrect username or password'
            })
          }
          const sub = user.username;
          const payload = { user_id: user.id };
          //Send id, username and Token
          res.send({
            user_id: user.id,
            username: user.username,
            authToken: AuthService.createJwt(sub, payload)
          });
        })
    })
    .catch(next);

})

module.exports = authRouter;