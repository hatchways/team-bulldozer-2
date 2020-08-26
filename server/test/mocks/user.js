const validUser = {
  email: 'houssem@example.com',
  firstName: 'Houssem Eddine',
  lastName: 'My Last Name',
  password: '123456',
  confirmPassword: '123456',
};

const userWithInvalidPassword = {
  email: 'houssem@example.com',
  firstName: 'Houssem Eddine',
  lastName: 'My Last Name',
  password: '123',
  confirmPassword: '123456',
};

const userWithEmptyFisrtName = {
  email: 'houssem@example.com',
  firstName: null,
  lastName: 'My Last Name',
  password: '123',
  confirmPassword: '123456',
};

const invalidCredentials = {
  email: 'houssem@example.com',
  password: '458e@c',
};

const validCredentials = {
  email: 'houssem@example.com',
  password: '123456',
};

module.exports = {
  validUser,
  userWithInvalidPassword,
  userWithEmptyFisrtName,
  invalidCredentials,
  validCredentials,
};
