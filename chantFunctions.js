
const express = require('express');
const newsRoutes = express.Router();

// Require News model in our routes module
let News = require('./news_model.js').chant;

  // Defined get data(index or listing) route
  newsRoutes.route('/').get(function (req, res) {
      News.find().limit(300).exec(function(err, newses){
      if(err){
        console.log(err);
      }
      else {
        res.json(newses);
      }
    });
  });
  newsRoutes.route('/edit/:id').get(function (req, res) {
      News.findById(req.params.id, function(err, news){
      if(err){
        console.log(err);
      }
      else {
        res.json(news);
      }
    });
  });
  newsRoutes.route('/search/:tag').get(function (req, res) {
    var searchTag = req.params.tag.toString()
      News.find({'tags': { '$regex' : '.*' +searchTag+'.*' }}).sort({date:-1}).exec(function(err, news){
        if(err){
          console.log(err);
        }
        else {
          res.json(news);
        }
      }); 
  });
  newsRoutes.route('/search/multitag/:tags').get(function (req, res) {
    var multiTag = req.params.tags.split(',')
      News.find({'tags': { '$all' : multiTag }}).sort({date:-1}).exec(function(err, news){
        if(err){
          console.log(err);
        }
        else {
          res.json(news);
        }
      }); 
  });
  newsRoutes.route('/searchsimilar/:tag').get(function (req, res) {
    var searchTag = req.params.tag.toString()
      News.find({'tags': { '$regex' : '.*' +searchTag+'.*' }},(function(err, news){
        if(err){
          console.log(err);
        }
        else {
          res.json(news);
        }
      })); 
  });
  newsRoutes.route('/categorised').get(function (req, res) {
      News.find({'status': 'categorised'}).sort({UpdatedAt:-1}).exec(function(err, news){
      if(err){
        console.log(err);
      }
      else {
        res.json(news);
      }
    });
  });

  newsRoutes.route('/new').get(function (req, res) {
      News.findOne({'status': 'new'}).sort({ date: -1 }).exec(function(err, news){
      if(err){
        console.log(err);
      }
      else {
        res.json(news);
      }
    });
  });
  newsRoutes.route('/new/all').get(function (req, res) {
      News.find({'status': 'new'}).limit(300).sort({ date: -1 }).exec(function(err, news){
      if(err){
        console.log(err);
      }
      else {
        res.json(news);
      }
    });
  });
  //Defined update route
  newsRoutes.route('/update/old/:id').post(function (req, res) {
    News.findById(req.params.id, function(err, news) {
      if (!news)
        res.status(404).send("data is not found"+err);
      else {
          news.tags = req.body.tags;
          news.status = req.body.status;
    
          news.save().then(news => {
            res.json('Update complete');
        })
        .catch(err => {
              res.status(400).send("unable to update the database");
        });
      }
    });
  });

module.exports = newsRoutes;
