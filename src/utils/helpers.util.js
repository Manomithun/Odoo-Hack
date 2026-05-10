const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const generateShareToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const generateUUID = () => uuidv4();

const slugify = (text) => {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

const calculateTripDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

module.exports = { generateShareToken, generateUUID, slugify, calculateTripDays };
