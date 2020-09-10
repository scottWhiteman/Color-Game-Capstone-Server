const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')

describe('Auth Endpoints', function() {
  let db;

  const { testUsers } = helpers.makeFixtures();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe(`POST /api/auth/login`, () => {
    beforeEach('insert users', () => {
      return helpers.seedUsers(
        db,
        testUsers
      )
    })

    const requiredFields = ['username', 'password'];

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        username: testUser.username,
        password: testUser.password
      }
      
      it(`400 error when '${field}' is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request`
          })
      });
      it(`400 'Invalid username or password' when invalid username`, () => {
        const invalidUser = { username: 'none', password: 'wrong' };
        return supertest(app)
          .post('/api/auth/login')
          .send(invalidUser)
          .expect(400, {
            error: `Incorrect username or password`
          });
      });
      it(`400 'Invalid username or password' when invalid password`, () => {
        const invalidPassword = { username: testUser.username, password: 'wrong' };
        return supertest(app)
          .post('/api/auth/login')
          .send(invalidPassword)
          .expect(400, {
            error: `Incorrect username or password`
          })
      })

      it(`200 and JWT auth token using secret valid credentials`, () => {
        const userValidCreds = {
          username: testUser.username,
          password: testUser.password
        }
        const expectedToken = jwt.sign(
          { user_id: testUser.id },
          process.env.JWT_CODE,
          {
            subject: testUser.username,
            algorithm: 'HS256'
          }
        )
        return supertest(app)
          .post('/api/auth/login')
          .send(userValidCreds)
          .expect(200, {
            user_id: testUser.id,
            username: testUser.username,
            authToken: expectedToken
          });
      })
    })
  })
})