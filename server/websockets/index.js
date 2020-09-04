/* eslint-disable no-unused-vars */
const socketio = require('socket.io');
const passportSocketIo = require('passport.socketio');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const redisUrl = require('redis-url');
const cookieParser = require('cookie-parser');
const config = require('./config');
const { SubcribeTo } = require('../utils/redis');

const sessionStore = new RedisStore({ client: redisUrl.connect(process.env.REDIS_URL) });

module.exports = (server) => {
  function onAuthorizeSuccess(data, accept) {
    accept();
  }
  function onAuthorizeFail(data, message, error, accept) {
    if (error) throw new Error(message);
    return accept(new Error(message));
  }

  // Init socket.io
  const io = socketio(server, config);
  // Init passport.socket.io
  io.use(passportSocketIo.authorize({
    secret: process.env.SESSION_SECRET_KEY,
    store: sessionStore,
    cookieParser,
    success: onAuthorizeSuccess, // the accept-callback still allows us to decide whether to
    fail: onAuthorizeFail, // *optional* callback on fail/error
  }));

  // on connection event
  io.on('connection', (socket) => {
    // receive the interview id (room) from handshake query
    const { room } = socket.handshake.query;
    // subscribe the socket to the room whose name is the ID of the interview
    // use to handle the code change event in the editor
    socket.join(room);
    // subscribe to the redis channel which has the same name as the socket room
    SubcribeTo(room, (message) => {
      const eventMessage = JSON.parse(message);
      // send a message to the room
      socket.emit(eventMessage.action, eventMessage.content);
    });
  });

  return server;
};
