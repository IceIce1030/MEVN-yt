const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const videos = require('./db/videos');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Behold The MEVN Stack!'
  });
});

app.get('/videos', (req, res) => {
  videos.getAll().then((videos) => {
    res.json(videos);
  });
});

app.post('/videos', (req, res) => {
  console.log(req.body);
  videos.create(req.body).then((message) => {
    res.json(message);
  }).catch((error) => {
    res.status(500);
    res.json(error);
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});