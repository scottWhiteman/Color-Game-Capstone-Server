## Color Game Server

This is a small project for connecting the front and back ends.
This app uses React for the front-end and PostgreSQL for the back-end

## Summary

This API manages user and score data.  It allows utilization of Logins, Registrations, User descriptions, score returns and score postings.

## How it works

This is a small color game where the player is given a condition and a set of randomized colors.
The player must pick the colors that match the condition.
Each correct answer gives a point and incorrect answers end the game.

## EndPoints

POST /api/auth/login
{
  username,
  password
}
takes "username" and "password" from body and returns an authorization token if valid.
Use for logging in.

POST /api/users/
{
  username,
  password
}
creates a new user with "username" and "password" and returns created data.
Use to create new users.

GET /api/users/:user_id
Gets username of user.

DELETE /api/user/:user_id
Deletes user with id
Also deletes any scores associated with that user

PATCH /api/user/:user_id
{
  username,
  password
}
Changes user with "username" and "password" from body
Use to allow users to change usernames and passwords

GET /api/user/:user_id/blog
Retrieves blog of user at id

PATCH /api/user/:user_id/blog
{
  blogpost
}
Updated user blog to new "blogpost" from body
Use to change description of user

GET /api/scores
Retrieves scores from database

POST /api/scores
{
  user_id
  score
}
Posts new score into score data with "user_id" and "score" from body
Use to create a new score in the database

## Screenshots

![Mobile view](/screenshots/Screen2.png)
![Desktop view](/screenshots/Screen3.png)
![Leaderboards](/screenshots/Screen1.png)
![Results](/screenshots/Screen4.png)

## Tech
Node.js
Express
Knex
SQL + PostgreSQL

## Demo 

https://colorgame.scottwhiteman.vercel.app

## Client

https://github.com/scottWhiteman/Color-Game-Capstone
