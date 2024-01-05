require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dns = require('node:dns');

mongoose.connect(process.env.MONGODB_URI)

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/index.html');
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

app.route('/api/shorturl/:shorturl')
.get(function(req, res) {
  var shorturl = req.params.shorturl;
  var urlQuery = urlModel.find({short_url: shorturl}).exec();
  urlQuery.then(function(doc) {
    res.redirect(doc[0].original_url);
  });
});

app.route('/api/:shorturl')
.post(
  function(req, res) {
    let originalUrl = req.body.url;
    let urlObject = new URL(originalUrl);

    dns.lookup(urlObject.hostname, (err) => {
      if (err) {
        res.json({'error': 'invalid url'})
      } else {
        var maxShortUrl = urlModel.find({__v: 0}).sort({short_url: - 1}).limit(1).exec();

        maxShortUrl.then(function(doc) {
          var newShortUrl = doc[0].short_url + 1;
          var newURL = new urlModel({
            original_url: originalUrl,
            short_url: newShortUrl
          });

          res.json({
            original_url: req.body.url,
            short_url: newShortUrl
          });

          newURL.save();
        });
      }
    }
  )}
);

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
