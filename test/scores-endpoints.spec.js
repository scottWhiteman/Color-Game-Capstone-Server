const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')
const { expect } = require('chai')

describe.only('Protected Endpoints', () => {
  let db;

  const { testUsers, testScores } = helpers.makeFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /api/scores/topscores', () => {
    // it(`responds 200 with an array`, () => {
    //   return supertest(app)
    //     .get('/api/scores/topscores')
    //     expect(200, Array.isArray())
    // })
    beforeEach('insert data', () => {
      return helpers.seedColorgameTables(db, testUsers, testScores);
    });
    it(`responds 200 with list of top scores`, () => {
      return supertest(app)
        .get('/api/scores/topscores')
        .expect(200, [
          {
            topscore: 54,
            username: "test-three"
          },
          {
            topscore: 15,
            username: "test-one"
          },
          {
            topscore: 8,
            username: "test-two"
          }
        ])
    })
  })
  describe('Post /api/scores', () => {
    beforeEach('insert data', () => {
      return helpers.seedUsers(db, testUsers);
    });
    it(`responds 201 after creating new score`, function() {
      this.retries(3);
      const testUser = testUsers[0];
      const newScore = {
        score: 100,
        user_id: testUser.id
      }

      return supertest(app)
        .post('/api/scores')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newScore)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.score).to.eql(newScore.score)
          expect(res.body.user_id).to.eql(newScore.user_id)
          const expectedDate = new Date().toLocaleString()
          const actualDate = new Date(res.body.date_created).toLocaleString()
          expect(actualDate).to.eql(expectedDate)
        })
        .expect(res => {
          return db
            .from('colorgame_scores')
            .select('*')
            .where({id: res.body.id})
            .first()
            .then(row => {
              expect(row.score).to.eql(newScore.score)
              expect(row.user_id).to.eql(newScore.user_id)
              const expectedDate = new Date().toLocaleString()
              const actualDate = new Date(row.date_created).toLocaleString()
              expect(actualDate).to.eql(expectedDate)
            })
        })
    })
  })
})