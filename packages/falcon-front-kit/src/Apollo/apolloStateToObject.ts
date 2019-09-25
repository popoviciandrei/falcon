/**
 * This method expands flatten Apollo cache value into a nested object
 * @param {object} state Apollo state object
 * @param {string} stateKey Apollo state key
 * @returns {object} Expanded object
 */
export function apolloStateToObject(state: object, stateKey: string): object {
  const result = { ...state[stateKey] };

  Object.keys(result).forEach(key => {
    const value = result[key];

    if (!value) {
      return;
    }

    if (Array.isArray(value)) {
      result[key] = value
        .filter(item => item && typeof item === 'object' && item.generated && item.id)
        .map(item => apolloStateToObject(state, item.id));
    } else if (typeof value === 'object') {
      if (value.generated && value.id) {
        result[key] = apolloStateToObject(state, value.id);
      } else if (value.type === 'json') {
        result[key] = value.json;
      }
    }
  });

  return result;
}
