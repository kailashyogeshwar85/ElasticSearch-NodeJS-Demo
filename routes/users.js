const express = require('express');
const router = express.Router();
const Engine = require('./../engine');


router.post('/search', function(req, res, next) {
	const query = {
	  query: {
	    match: {
	      name: {
	        query: req.body.search
	      }
	    }
	  }
	} 
  Engine.search(query)
  .then(result => {
  	return res.send(result).statudCode(200);
  })
});

router.get('/suggest', function(req, res, next) {
  console.log("request query ", req.query);
  Engine.suggest(req.query.search, 'restaurants')
  .then(result => {
  	console.log(result)
  	return res.json(result);
  }, (err) => {
  	 res.send(err)
  })
});

module.exports = router;
