const User = require('../models/userModel');

exports.createUser = async (req, res, next) => {
  try {
    const newUser = {
      name: 'mehul',
    };
  } catch (error) {
    res.status(500).json({
      status: 'success',
      data: newUser,
    });
  }
};
