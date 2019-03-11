var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


const { Client } = require('pg');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

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

router.get('/steamer', function(req, res, next) {
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
      var queryString = 'select a.pid, a.name, a.type, a.team, a.elig, a.stat1, a.stat2, a.stat3, a.stat4, a.stat5, a.countstat, b.price, b.ownerid, b.rosterspot, b.draftnumber, c.note from (steamer as a LEFT JOIN rosters as b on a.pid = b.pid) LEFT JOIN playernotes as c on a.pid = c.pid';
  		client.query(queryString, (err, response) => {
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

router.get('/rotochamp', function(req, res, next) {
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
      var queryString = 'select a.pid, a.name, a.type, a.team, a.elig, a.stat1, a.stat2, a.stat3, a.stat4, a.stat5, a.countstat, b.price, b.ownerid, b.rosterspot, b.draftnumber, c.note from (rotochamp as a LEFT JOIN rosters as b on a.pid = b.pid) LEFT JOIN playernotes as c on a.pid = c.pid';
      client.query(queryString, (err, response) => {
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

router.get('/thebat', function(req, res, next) {
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
      var queryString = 'select a.pid, a.name, a.type, a.team, a.elig, a.stat1, a.stat2, a.stat3, a.stat4, a.stat5, a.countstat, b.price, b.ownerid, b.rosterspot, b.draftnumber, c.note from (thebat as a LEFT JOIN rosters as b on a.pid = b.pid) LEFT JOIN playernotes as c on a.pid = c.pid';
      client.query(queryString, (err, response) => {
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

router.post('/playerupdate', function(req, res, next) {
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
      var queryString = "INSERT INTO rosters(pid,name,price,ownerid,rosterspot,draftnumber) VALUES ("+req.body.pid+",'"+req.body.player+"',"+req.body.amount+","+req.body.ownerid+",'"+req.body.rosterspot+"',"+req.body.draftnumber+")";
      console.log(queryString);
      client.query(queryString, (err, response) => {
        if (err) {
          console.log('Error querying db.');
          throw err;
        } else {
          console.log('Succesfully updated rosters table.')
          res.send({status: 'hazaa!'});
        }
        client.end();
      });
    }
  });
});

router.post('/playerremove', function(req, res, next) {
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
      var queryString = "DELETE FROM rosters WHERE name='" + req.body.name +"'";
      console.log(queryString);
      client.query(queryString, (err, response) => {
        if (err) {
          console.log('Error querying db.');
          throw err;
        } else {
          console.log('Succesfully updated rosters table.')
          res.send({status: 'hazaa!'});
        }
        client.end();
      });
    }
  });
});

module.exports = router;
