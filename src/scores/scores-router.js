const express = require('express');
const path = require('path');
const ScoresService = require('./scores-service');
const { requireAuth } = require('../middlewares/jwt-auth');

const scoresRouter = express.Router();
const jsonBodyParser = express.json();

//Scores route
scoresRouter.route('/')
  //Get all scores
  .get((req, res, next) => {
    ScoresService.getAllScores(req.app.get('db'))
      .then(scores => {
        res.json(scores)
      })
      .catch(next);
  })
  //Add new score to database
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { user_id, score } = req.body;
    const newScore = { user_id, score };

    //Check if id and scores exist
    for (const [key, value] of Object.entries(newScore)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing ${key} in request`
        });
      }
    }
    //Insert new score
    ScoresService.insertScore(
      req.app.get('db'),
      newScore
    )
      .then(score => {
        res.status(201)
          .json(score);
      })
      .catch(next);
    
  })

  //Return top scores of each user
  scoresRouter.route('/topscores')
    .get((req, res, next) => {
      ScoresService.getTopScores(req.app.get('db'))
        .then(topScores => {
          res.json(topScores)
        })
        .catch(next);
    })

  module.exports = scoresRouter;