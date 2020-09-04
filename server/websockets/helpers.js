/* eslint-disable no-underscore-dangle */
const CreateRedisMessage = (user, action) => {
  const message = {
    action,
    content: {
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
    },
  };

  return JSON.stringify(message);
};

module.exports = { CreateRedisMessage };
