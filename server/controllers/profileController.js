// backend/controllers/profileController.js
const profileRepository = require('../repositories/profileRepository');

const getProfile = async (req, res) => {
  try {
    const user = await profileRepository.getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProfile,
};
