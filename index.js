require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

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
  shorturl: {
    type: Number,
    required: true
  }
});

const url = mongoose.model('url', urlSchema);

app.route('/api/:shorturl')
.get(function(req, res) {
    
}).post(
  function(req, res) {
    var shorturl = req.params.shorturl;
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
