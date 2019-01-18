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
    			console.log('Succesful teams query.')
    			res.render('index', { data: response.rows });
    		}
    		client.end();
  		});
  	}
  });
});

router.get('/players', function(req, res, next) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  client.connect(function (err, client, done) {
  	if (err) {
  		console.log('Cannot connect to db from js req.');
  		throw err;
  	} else {
  		console.log('Successfully connected to db from js req.')
  		client.query('SELECT * FROM allplayers ORDER BY value DESC;', (err, response) => {
  			if (err) {
  				console.log('Error querying db.');
  				throw err;
  			} else {
    			console.log('Succesful players query.')
    			res.send({players: response.rows});
    		}
    		client.end();
  		});
  	}
  });
});

module.exports = router;
