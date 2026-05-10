const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/response.util');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return sendSuccess(res, result, 'Registration successful', 201);
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return sendSuccess(res, result, 'Login successful');
  } catch (err) { next(err); }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    return sendSuccess(res, user, 'Profile retrieved');
  } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user.id, req.body);
    return sendSuccess(res, user, 'Profile updated');
  } catch (err) { next(err); }
};

module.exports = { register, login, getProfile, updateProfile };
