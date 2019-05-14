const Joi = require('joi');
const db = require('./connection');

const schema = Joi.object().keys({
  username: Joi.string().alphanum().required(),
  subject: Joi.string().required(),
  message: Joi.string().max(500).required(),
  imageURL: Joi.string().uri({
    scheme: [
      /https?/
    ]
  })
});

const collection = db.get('videos');

// get all videos
function getAll() {
  return collection.find({}, {
    sort: {
      publishedAt: -1
    }
  });
}

// get page video
function getPageVideos({
  myPage,
  channelId
}) {
  let page = myPage || 1; // 當前第幾頁
  let size = 30; // 每頁顯示的記錄條數
  // 顯示符合前端分頁請求的列表查詢
  let options = {
    "limit": size,
    sort: {
      publishedAt: -1
    },
    "skip": (page - 1) * size
  };
  let findOption = channelId !== 'all' ? {
    channelId
  } : {};
  return collection.find(findOption, options);
}

// get videos 總數
function getVideosCount(channelId) {
  try {
    let findOption = channelId !== 'all' ? {
      channelId
    } : {}
    return new Promise(function (resolve, reject) {
      collection.count(findOption).then((res) => {
        resolve(res);
      });
    });
  } catch (error) {
    // 處理 reject reason，讓程式繼續
    console.log('error=>', error)
  }
}

// get a channel's videos
function getChannelVideos({
  channelId
}) {
  console.log({
    channelId
  })
  return collection.find({
    channelId: channelId
  }, {
    sort: {
      publishedAt: -1
    }
  });
}

// delete a video
function deleVideo(_id) {
  collection.remove({
    videoId: _id
  });
  return 'delete a video success!';
}


function create(message) {
  if (!message.username) message.username = 'Anonymous';

  const result = Joi.validate(message, schema);
  if (result.error == null) {
    message.created = new Date();
    return collection.insert(message);
  } else {
    return Promise.reject(result.error);
  }
}

module.exports = {
  create,
  getAll,
  getChannelVideos,
  deleVideo,
  getPageVideos,
  getVideosCount
};