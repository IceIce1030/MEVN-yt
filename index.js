const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const videos = require('./db/videos');
const channels = require('./db/channels');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

// home
app.get('/', (req, res) => {
  res.json({
    message: 'Behold The MEVN Stack!'
  });
});

// get all videos
app.get('/videos', (req, res) => {
  videos.getAll().then((videos) => {
    res.json(videos);
  });
});

// get a chanel videos
app.get('/videos/:channel', (req, res) => {
  var _channelId = req.params.channel;
  videos.getChannelVideos({
    channelId: _channelId
  }).then((videos) => {
    res.json(videos);
    console.log({
      _channelId,
      videos
    })
  });
});

// delete video (todo)
app.delete('/videos/:videoId', (req, res) => {
  var _videoId = req.params.videoId;
  res.json({
    message: 'Got a DELETE request at /videos, id is ' + _videoId
  });
});


// get all channels
app.get('/channels', (req, res) => {
  channels.getAll().then((channels) => {
    res.json(channels);
  });
});

// testing
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