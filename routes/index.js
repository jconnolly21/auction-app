var express = require('express');
var router = express.Router();

// const { Client } = require('pg');

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: true,
// });


/* GET home page. */
router.get('/', function(req, res, next) {
  // client.connect();
  // client.query('SELECT * FROM teams;', (err, response) => {
  // 	if (err) throw err;
  //   res.render('index', { title: 'Auction App', data: response.rows });
  //   client.end();
  // });
  res.render('index_test');
});

module.exports = router;
