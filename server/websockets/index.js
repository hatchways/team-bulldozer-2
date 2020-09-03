/* eslint-disable no-unused-vars */
const socketio = require('socket.io');
const passportSocketIo = require('passport.socketio');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const redisUrl = require('redis-url');
const cookieParser = require('cookie-parser');
const config = require('./config');

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
    const { room } = socket.handshake.query;

    socket.join(room);
    socket.send(`Hello ${socket.request.user.firstName} !! you just connected to the room ${room}`);

    // // or with emit() and custom event names
    // socket.emit('greetings', 'Hey!', { ms: 'jane' }, Buffer.from([4, 3, 3, 1]));
    // // handle the event sent with socket.emit()
    // socket.on('salutations', (elem1, elem2, elem3) => {
    //   console.log(elem1, elem2, elem3);
    // });
  });

  return server;
};
