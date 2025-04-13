const User = require("../models/User");

const createUser = async ({ firstName, lastName, email, password }) => {
  const user = new User({
    firstName,
    lastName,
    email,
    password,
  });

  return await user.save();
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const findUserById = async (userId) => {
  return await User.findById(userId);
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
