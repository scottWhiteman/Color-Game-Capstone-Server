const express = require('express');
const path = require('path');
const CommentsService = require('./comments-service');
const { requireAuth } = require('../middlewares/jwt-auth');

const commentsRouter = express.Router();
const jsonBodyParser = express.json();

commentsRouter.route('/')
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { user_id,  comment_text } = req.body;
    const newComment = { user_id, comment_text };

    for (const [key, value] of Object.entries(newComment)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing ${key} in request`
        });
      }
    }
    CommentsService.insertComment(
      req.app.get('db'),
      newComment
    )
      .then(comment => {
        res.status(201)
          .json(comment);
      })
      .catch(next);
  })