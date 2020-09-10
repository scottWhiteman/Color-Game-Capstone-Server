const xss = require('xss');

const ScoresService = {
  getAllScores(db) {
    return db.from('colorgame_scores')
      .select('*')
  },
  getScoreById(db, id) {
    return db.from('colorgame_scores')
      .select('*')
      .where('id', id)
      .first();
  },
  getTopScores(db) {
    return db.from('colorgame_scores AS cs')
      .select(
        db.raw(
          `MAX(cs.score) AS topscore`
        ),
        'cu.username'
      )
      .innerJoin(
        'colorgame_users AS cu',
        'cs.user_id',
        'cu.id'
      )
      .groupBy('cu.username')
      .orderBy('topscore', 'desc')
  },
  insertScore(db, newScore) {
    return db
      .insert(newScore)
      .into('colorgame_scores')
      .returning('*')
      .then(([score]) => score)
      .then(score => ScoresService.getScoreById(db, score.id))
  }
}

module.exports = ScoresService;