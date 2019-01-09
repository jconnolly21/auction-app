var express = require('express');
var router = express.Router();
var pg = require('pg');

/* GET home page. */
router.get('/', function(req, res, next) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM teams', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result.rows); }
    });
  });
  //res.render('index', { title: 'Auction App' });
});


module.exports = router;
