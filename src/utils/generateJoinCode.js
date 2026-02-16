const crypto = require('crypto');

/**
 * Gera um código alfanumérico uppercase de `length` caracteres.
 * @param {number} length
 * @returns {string}
 */
const generateJoinCode = (length = 6) => {
  return crypto.randomBytes(length).toString('hex').slice(0, length).toUpperCase();
};

module.exports = generateJoinCode;
