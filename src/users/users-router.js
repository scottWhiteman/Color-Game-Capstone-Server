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

    //Check password meets requirements
    const passwordError = UsersService.validatePassword(password);

    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }
    //Check if username exists in database
    UsersService.hasUserWithUserName(
      req.app.get('db'),
      username
    )
      //User already taken
      .then(hasUserWithUserName => {
        if (hasUserWithUserName) {
          return res.status(400).json({ error: `Username already taken` })
        }
        //Hash the password
        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              username,
              password: hashedPassword
            }
            //Create new user
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
    //Find user by id
    UsersService.getUserById(
      req.app.get('db'),
      req.params.user_id
    )
      .then(user => {
        //User not found
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
  //Get user and return it
  .get(jsonBodyParser, (req, res, next) => {
    UsersService.getUserById(req.app.get('db'), req.params.user_id)
      .then(user => {
        res.status(200).send({username: user.username})
      })
      .catch(next);
  })
  //Delete user at id
  .delete((req, res, next) => {
    UsersService.deleteUser(
        req.app.get('db'),
        req.params.user_id
      )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next);
  })
  //Update user username and password
  .patch(jsonBodyParser, (req, res, next) => {
    const { username, password } = req.body;
    const updatedUser = { username, password };

    const numberOfValues = Object.values(updatedUser).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: { message: `Request body must contain username or password` }
      })
    }
    return UsersService.hashPassword(password)
      .then(hashedPassword => {
        const updatedHashedUser = {
          username,
          password: hashedPassword
        }
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
  });

//User blogpost column
usersRouter.route('/:user_id/blog')
  .all((req, res, next) => {
    //Search user id
    UsersService.getUserById(
      req.app.get('db'),
      req.params.user_id
    )
      .then(user => {
        //If user not found
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
    //Return user blog
    UsersService.getUserById(req.app.get('db'), req.params.user_id)
      .then(user => {
        res.status(200).send({blogpost: user.blogpost})
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    //Change user blog to given text
    const { blogpost } = req.body;
    UsersService.updateBlog(req.app.get('db'), req.params.user_id, blogpost)
      .then(rows => {
        res.status(204).end();
      })
      .catch(next);
  })
  

module.exports = usersRouter