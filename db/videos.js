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
  deleVideo
};