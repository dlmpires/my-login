import express from 'express';
import db from './configs/db.js';
import session from 'express-session';
import passport from './strategies/local.js';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

const app = express()
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

//Test Route
app.get('/', (req, res) => {
    res.send('ola')
})

//Register Users
app.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    db.query('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [email, username, hashedPassword], (err) => {
      if (err) {
        // MySQL error code for a duplicate entry is 'ER_DUP_ENTRY', which has the error code 1062
        if (err.code === 'ER_DUP_ENTRY') {
          res.status(409).send('Email or username already exists.');
        } else {
          console.log(err); 
          res.status(500).send('Error registering user');
        }
        return;
      }
      res.status(201).send('User Registered')
    })
  } catch (err) {
    res.status(500).send('Server error')
  }
})

// If login is sucessful, user gets redirected to dashboard, if not, goes back to login page
app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
}))

// Dashboard route (checks if user is logged in)
app.get('/dashboard', (req,res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login')
  } else {
    res.send('You are on your dashboard.')
  }
})

// Logout route
app.get('/logout', (req,res) => {
    req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  })
})

app.listen(6969, () => {
    console.log(`App listening on http://localhost:${6969}`);
  });