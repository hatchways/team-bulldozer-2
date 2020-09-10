/* eslint-disable no-shadow */
const redis = require('redis');

const subscriber = redis.createClient();
const publisher = redis.createClient();

// publish a message on a given channel
const PublishOn = (channel, message) => {
  publisher.publish(channel, message);
};
// subscribe to a given channel and listen to the events published on it
const SubcribeTo = (channel, callback) => {
  subscriber.subscribe(channel);
  subscriber.on('message', (channel, message) => {
    callback(message);
  });
};

module.exports = { SubcribeTo, PublishOn };
