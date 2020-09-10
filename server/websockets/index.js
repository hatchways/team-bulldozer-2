/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
const socketio = require('socket.io');
const passportSocketIo = require('passport.socketio');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const redisUrl = require('redis-url');
const cookieParser = require('cookie-parser');
const config = require('./config');
const { SubcribeTo } = require('../utils/redis');
const { Interview } = require('../models/interview');
const InterviewService = require('../services/interviewService');

const sessionStore = new RedisStore({
  client: redisUrl.connect(process.env.REDIS_URL),
});

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
  io.use(
    passportSocketIo.authorize({
      secret: process.env.SESSION_SECRET_KEY,
      store: sessionStore,
      cookieParser,
      success: onAuthorizeSuccess, // the accept-callback still allows us to decide whether to
      fail: onAuthorizeFail, // *optional* callback on fail/error
    }),
  );

  // on connection event
  io.on('connection', (socket) => {
    // Emit socket id
    socket.emit('yourSocketID', socket.id);
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
    // On disconnecting event
    socket.on('disconnecting', async (reason) => {
      const { user } = socket.request;
      const interview = await Interview.findOne({ _id: room }, { __v: false }).exec();
      // remove the user from the list of participants and notify the other user
      if (interview) {
        await InterviewService.exit(user, interview);
      }
    });
    // Handle start interview event
    socket.on('onStartInterview', (data) => {
      io.to(room).emit('startInterview', data);
    });
    // handle change interview code event
    socket.on('onChangeCode', (data) => {
      io.to(room).emit('changeCode', data);
    });
    // Handle call participant event
    socket.on('callParticipant', (data) => {
      io.to(room).emit('onCalling', { signal: data.signalData, from: data.from });
    });
    // Handle accept call event
    socket.on('acceptCall', (data) => {
      io.to(data.to).emit('callAccepted', data.signal);
    });
    // Disconnect
    socket.on('disconnect', (data) => {
      console.log('disconnect :>> ', socket.id);
    });
  });

  return server;
};
