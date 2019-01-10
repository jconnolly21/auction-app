var express = require('express');
var router = express.Router();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});


/* GET home page. */
router.get('/', function(req, res, next) {
  client.connect(function (err, client, done) {
  	client.query('SELECT * FROM teams;', (err, response) => {
  		if (err) {
  			console.log('Error querying db.');
  			throw err;
  		} else {
    		console.log('Succesfully queried db.')
    		res.render('index', { data: response.rows });
    	}
    	client.release();
  	});
  });
});

module.exports = router;
