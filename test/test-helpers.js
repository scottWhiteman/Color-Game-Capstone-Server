const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-one',
      password: 'password',
      date_created: '2020-01-22T16:28:32.615Z'
    },
    {
      id: 2,
      username: 'test-two',
      password: 'password',
      date_created: '2020-01-22T16:28:32.615Z'
    },
    {
      id: 3,
      username: 'test-three',
      password: 'password',
      date_created: '2020-01-22T16:28:32.615Z'
    }
  ];
}

function makeScoresArray(users) {
  return [
    {
      id: 1,
      score: 5,
      user_id: users[0].id,
      date_created: '2020-01-22T16:28:32.615Z'
    },
    {
      id: 2,
      score: 15,
      user_id: users[0].id,
      date_created: '2020-01-22T16:28:32.615Z'
    },
    {
      id: 3,
      score: 2,
      user_id: users[0].id,
      date_created: '2020-01-22T16:28:32.615Z'
    },
    {
      id: 4,
      score: 8,
      user_id: users[1].id,
      date_created: '2020-01-22T16:28:32.615Z'
    },
    {
      id: 5,
      score: 54,
      user_id: users[2].id,
      date_created: '2020-01-22T16:28:32.615Z'
    }
  ];
}

function makeFixtures() {
  const testUsers = makeUsersArray();
  const testScores = makeScoresArray(testUsers);
  return { testUsers, testScores };
}

function seedUsers(db, users) {
  const prepUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('colorgame_users').insert(prepUsers)
    .then(() => {
      return db.raw(
        `SELECT setval('colorgame_users_id_seq', ?)`,
        [users[users.length-1].id]
      )
    })
}

function seedColorgameTables(db, users, scores) {
  return seedUsers(db, users)
    .then(() => {
      return db
        .into('colorgame_scores')
        .insert(scores)
    })
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      colorgame_users,
      colorgame_scores
      RESTART IDENTITY CASCADE`
  );
}

function makeAuthHeader(user, secret = process.env.JWT_CODE) {
  const token = jwt.sign({user_id: user.id}, secret, {
    subject: user.username,
    algorithm: 'HS256'
  })

  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeScoresArray,
  makeFixtures,

  seedUsers,
  seedColorgameTables,
  cleanTables,
  makeAuthHeader
}