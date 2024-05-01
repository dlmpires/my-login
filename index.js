import express from 'express';
import db from './db.js';
import passport from 'passport';
import bodyParser from 'body-parser';

const app = express()
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send('ola')
})

app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) {
        res.status(500).send('Error fetching users');
        return;
      }
      res.json(results);
    });
  });

app.listen(6969, () => {
    console.log(`App listening on http://localhost:${6969}`);
  });