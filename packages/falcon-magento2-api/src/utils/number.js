/**
 * Try to parse provided value to `number` (using `Number.parseFloat()`)
 * @param {object} x value to parse
 * @returns {number|undefined} if can parse then `number` or `undefined` otherwise
 */
function tryParseNumber(x) {
  const parsed = Number.parseFloat(x);

  return Number.isNaN(parsed) ? undefined : parsed;
}

module.exports = {
  tryParseNumber
};
