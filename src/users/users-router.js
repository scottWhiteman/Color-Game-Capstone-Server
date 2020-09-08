const express = require('express');
const UsersService = require('./users-service');
const { json } = require('express');
const { hash } = require('bcryptjs');

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { username, password } = req.body;
    for (const field of ['username', 'password']) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: `Missing ${field} in request`
        });
      }
    }

    const passwordError = UsersService.validatePassword(password);

    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }
    UsersService.hasUserWithUserName(
      req.app.get('db'),
      username
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName) {
          return res.status(400).json({ error: `Username already taken` })
        }
        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              username,
              password: hashedPassword
            }

            return UsersService.insertUser(req.app.get('db'), newUser)
              .then(user => {
                res.status(201).json(username);
            });
        })
      })
      .catch(next);
  })

usersRouter.route('/:user_id')
  .all((req, res, next) => {
    UsersService.getUserById(
      req.app.get('db'),
      req.params.user_id
    )
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User does not exist` }
          });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .get(jsonBodyParser, (req, res, next) => {
    UsersService.getUserById(req.app.get('db'), req.params.user_id)
      .then(user => {
        //console.log(user.username);
        res.status(200).send({username: user.username})
      })
      .catch(next);
    // res.status(200).send({
    //   username: user.username
    // });
  })
  .delete((req, res, next) => {
    UsersService.deleteUser(
        req.app.get('db'),
        req.params.user_id
      )
      .then(numRowsAffected => {
        console.log(`${req.params.user_id} deleted`)
        res.status(204).end()
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { username, password } = req.body;
    const updatedUser = { username, password };

    const numberOfValues = Object.values(updatedUser).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: { message: `Request body must contain username or password` }
      })
    }
    // if (UsersService.hasUserWithUserName(username)) {

    // }
    
    return UsersService.hashPassword(password)
      .then(hashedPassword => {
        const updatedHashedUser = {
          username,
          password: hashedPassword
        }
        console.log(updatedHashedUser);
        return UsersService.updateUser(
          req.app.get('db'),
          req.params.user_id,
          updatedHashedUser
        )
          .then(rows => {
            res.status(204).end()
          })
          .catch(next);
      })
    // UsersService.updateUser(
    //   req.app.get('db'),
    //   req.params.user_id,
    //   updatedUser
    // )
    //   .then(rows => {
    //     res.status(204).end();
    //   })
    //   .catch(next);
  });
  

module.exports = usersRouter