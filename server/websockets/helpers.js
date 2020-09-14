/* eslint-disable no-underscore-dangle */
const CreateRedisConnectionMessage = (interview, user, action) => {
  const message = {
    action,
    content: {
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      interview,
    },
  };

  return JSON.stringify(message);
};

const CreateRedisCodeCompilationMessage = (interview, compilationResult, action) => {
  const message = {
    action,
    content: {
      result: compilationResult,
      interview,
    },
  };

  return JSON.stringify(message);
};

module.exports = { CreateRedisConnectionMessage, CreateRedisCodeCompilationMessage };
