## Color Game Server

This is a small project for connecting the front and back ends.
This app uses React for the front-end and PostgreSQL for the back-end

## How it works

This is a small color game where the player is given a condition and a set of randomized colors.
The player must pick the colors that match the condition.
Each correct answer gives a point and incorrect answers end the game

## Features

This app features login and registration of accounts.
Users can delete or edit the password of the account.

## Screenshots

![Mobile view](/screenshots/Screen2.png)
![Desktop view](/screenshots/Screen3.png)
![Leaderboards](/screenshots/Screen1.png)
![Results](/screenshots/Screen4.png)

## Components

Primary pages:
  Game
  Home/About
  Leaderboards
  Login
  Registration
  Settings
  404 Page

The main app links to each page; most pages have a set of unique components, though some are used multiple times, such as the login and registration forms.

Components:
App
  
  Header
  
  GameMain
  
    ColorBox
  
    Condition
  
    Results
  
  HomeMain
  
  Leaderboards
  
  LoginForm
  
  RegistrationForm
  
  SettingsMain
  
    BlogContainer
  
  NotFoundMain
## Demo 

https://colorgame.scottwhiteman.vercel.app
