var express = require('express');
var router = express.Router();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Auction App' });
});


router.get('/db', function(req, res) {
  client.connect();
  
  client.query('SELECT * FROM teams;', (err, res) => {
    if (err) throw err;
    var rows = res.rows;
    client.end();
  });
  res.render('db', { title: 'Auction App', data: rows});
});

module.exports = router;
