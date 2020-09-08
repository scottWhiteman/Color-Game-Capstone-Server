const express = require('express');
const AuthService = require('./auth-service');

const authRouter = express.Router();
const jsonBodyParser = express.json();

// authRouter.route('/')
//   .get((req, res, next) => {
//     AuthService.getAllUsers(req.app.get('db'))
//       .then(users => {
//         res.json(users);
//       })
//       .catch(next);
//   });

authRouter.post('/login', jsonBodyParser, (req, res, next) => {
  const { username, password } = req.body;
  const loginUser = { username, password };

  for (const [key, value] of Object.entries(loginUser)) {
    if (value == null) {
      return res.status(400).json({
        error: `Missing ${key} in request`
      });
    }
  }

  AuthService.getUserByUserName(req.app.get('db'), loginUser.username)
    .then(user => {
      if (!user) {
        return res.status(400).json({
          error: 'Incorrect user or password'
        });
      }

      return AuthService.comparePasswords(loginUser.password, user.password)
        .then(match => {
          if (!match) {
            return res.status(400).json({
              error: 'Incorrect user or password'
            })
          }
          const sub = user.username;
          const payload = { user_id: user.id };
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