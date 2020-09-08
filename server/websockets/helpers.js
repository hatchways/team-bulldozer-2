/* eslint-disable no-underscore-dangle */
const CreateRedisMessage = (interview, user, action) => {
  const message = {
    action,
    content: {
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      interview: interview
    },
  };

  return JSON.stringify(message);
};

module.exports = { CreateRedisMessage };
