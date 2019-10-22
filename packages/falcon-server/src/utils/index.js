const crypto = require('crypto');

/**
 * Creates short hash for the given data
 * @param {string|string[]} data Data to create hash
 * @returns {string} Hashed string
 */
const createShortHash = data =>
  crypto
    .createHash('sha1')
    .update((Array.isArray(data) ? data : [data]).join(':'))
    .digest('base64');

module.exports = {
  createShortHash
};
