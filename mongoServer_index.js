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

// 取得所有影片資料
app.get('/videos', (req, res) => {
  videos.getAll().then((videos) => {
    res.json(videos);
  });
});

// 取得某頁影片資料
app.get('/videosPage/:channelId/:pages', (req, res) => {
  var _page = req.params.pages;
  var _channelId = req.params.channelId || 'all';
  videos.getPageVideos({
    myPage: _page,
    channelId: _channelId
  }).then((result) => {
    return videos.getVideosCount(_channelId).then((count) => {
      result.push({
        total: count
      });
      return res.json(result);
    });
  });


});

// 取得某頻道的影片資料
app.get('/videos/:channel', (req, res) => {
  var _channelId = req.params.channel;
  videos.getChannelVideos({
    channelId: _channelId
  }).then((videos) => {
    res.json(videos);
  });
});

// delete video (todo)
app.delete('/videos/:videoId', (req, res) => {
  var _videoId = req.params.videoId;
  res.json({
    message: 'Got a DELETE request at /videos, id is ' + _videoId
  });
});


// 取得所有頻道資料
app.get('/channels', (req, res) => {
  channels.getAll().then((channels) => {
    res.json(channels);
  });
});

// 測試 post 
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