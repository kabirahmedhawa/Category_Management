
const User = require('../models/User');

const getUserById = async (userId) => {
  return await User.findById(userId).select('-password');
};

module.exports = {
  getUserById,
};
