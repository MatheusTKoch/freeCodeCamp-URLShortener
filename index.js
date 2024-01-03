require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL)

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: {
    type: Number,
    required: true
  }
});

const urlModel = mongoose.model('url', urlSchema);

app.route('/api/:shorturl')
.get(function(req, res) {
    var shorturl = req.params.shorturl;
    var urlQuery = urlModel.find({short_url: shorturl}).exec();
    urlQuery.then(function(doc) {
      res.redirect(doc[0].original_url)
    });
  }).post(
  function(req, done) {
    var maxShortUrl = urlModel.find().sort({short_url: - 1}).short_url;
    console.log(maxShortUrl);
    var newURL = new urlModel({
      original_url: req.body.url,
      short_url: 15
    });
    newURL.save();
  }
);

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
