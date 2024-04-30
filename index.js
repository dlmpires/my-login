import express from 'express';
import db from './db.js';

const app = express()
app.use(express.json());

app.get('/', (req, res) => {
    res.send('ola')
})

app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (error, results) => {
      if (error) {
        res.status(500).send('Error fetching users');
        return;
      }
      res.json(results);
    });
  });  

app.listen(6969, () => {
    console.log(`App listening on http://localhost:${6969}`);
  });