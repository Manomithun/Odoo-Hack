const bcrypt = require('bcryptjs');
const userRepo = require('../repositories/user.repository');
const { generateToken } = require('../utils/token.util');

const register = async ({ fullName, email, password, bio, language }) => {
  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) {
    const err = new Error('Email already registered.');
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await userRepo.create(
    { fullName, email, passwordHash, bio, language },
    { id: true, fullName: true, email: true, profileImage: true, bio: true, language: true, isVerified: true, createdAt: true },
  );

  const token = generateToken({ id: user.id, email: user.email });
  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken({ id: user.id, email: user.email });
  const { passwordHash, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

const getProfile = async (userId) => {
  const user = await userRepo.findById(userId, {
    id: true, fullName: true, email: true, profileImage: true,
    bio: true, language: true, isVerified: true, isAdmin: true,
    createdAt: true, updatedAt: true,
    _count: { select: { trips: true, savedDestinations: true } },
  });
  if (!user) {
    const err = new Error('User not found.'); err.statusCode = 404; throw err;
  }
  return user;
};

const updateProfile = async (userId, data) => {
  return userRepo.update(userId, data, {
    id: true, fullName: true, email: true, profileImage: true,
    bio: true, language: true, isVerified: true, updatedAt: true,
  });
};

module.exports = { register, login, getProfile, updateProfile };
