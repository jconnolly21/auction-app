var express = require('express');
var router = express.Router();

const { Client } = require('pg');

/* GET home page. */
router.get('/', function(req, res, next) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  client.connect(function (err, client, done) {
  	if (err) {
  		console.log('Cannot connect to db.');
  		throw err;
  	} else {
  		console.log('Successfully connected to db.')
  		client.query('SELECT * FROM teams;', (err, response) => {
  			if (err) {
  				console.log('Error querying db.');
  				throw err;
  			} else {
    			console.log('Succesfully queried db.')
    			res.render('index', { data: response.rows });
    		}
    		client.end();
  		});
  	}
  });
});

module.exports = router;
