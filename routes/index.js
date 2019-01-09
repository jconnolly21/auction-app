var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Auction App' });
});

// var pg = require('pg');

// router.get('/db', function (request, response) {
//   pg.connect(process.env.DATABASE_URL, function(err, client, done) {
//     client.query('SELECT * FROM test_table', function(err, result) {
//       done();
//       if (err)
//        { console.error(err); response.send("Error " + err); }
//       else
//        { response.send(result.rows); }
//     });
//   });
// });

// router.get('/thankyou', function (request, response) {
//   response.render('thanks', {title: 'Alpha Theta Portal'});
// });

// router.get('/gibber', function(request, response) {
//   response.render('gibber', { title: 'ATCIC (Gibber Fund)' });
// });

// router.get('/dues', function(request, response) {
//   response.render('dues', { title: 'Alpha Theta Dues' });
// });

module.exports = router;
