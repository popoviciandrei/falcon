/**
 * Resolves promise even if was rejected
 * @param {Promise} promise
 * @returns {Promise<{result?: any, error?: Error, isSuccess: boolean}>}
 */
function reflect(promise) {
  return promise.then(result => ({ result, isSuccess: true })).catch(error => ({ error, isSuccess: false }));
}

/**
 * Resolves all promise even if one of them was rejected
 * @param {Promise[]} promises
 * @returns {Promise<{result?: any, error?: Error, isSuccess: boolean}>[]}
 */
function reflectAll(promises) {
  return Promise.all(promises.map(x => reflect(x)));
}

module.exports = {
  reflect,
  reflectAll
};
