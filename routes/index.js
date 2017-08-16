var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/spaces';
// to access $ mongo localhost:27017/spaces


// Use connect method to connect to the server


/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendFile('index.html');
});

// router.get('/msgs', function(req, res, next){
// 	res.render('msgs');
// })

router.post('/', function(req, res, next){
	console.log(req.body)
	if(req.body.email){
		console.log('connect and store email in database');
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			db.collection('spaces').insertOne({email:req.body.email, createdAt: new Date()}, function(err, r) {
				assert.equal(null, err);
				assert.equal(1, r.insertedCount);
				db.close();
			});
		});
	} else {
		console.log('no email received');
	}
	res.redirect('/');
})

router.get('/stats', function(req, res, next){
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('spaces').find({},{sort:"createdAt"}).toArray(function(err, data) {
			db.close();
			res.json(data);
		});
	});
});

module.exports = router;
