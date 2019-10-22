/**
 * This method expands flatten Apollo cache value into a nested object
 * @param {Object} state Apollo state object
 * @param {string} key Apollo state key
 * @returns {Object} Expanded object
 */
export const apolloStateToObject = (state, key) => {
  const value = Object.assign({}, state[key]);
  Object.keys(value).forEach(vKey => {
    const vValue = value[vKey];
    if (!vValue) {
      return;
    }
    if (Array.isArray(vValue)) {
      value[vKey] = [];
      vValue.forEach((vv, vi) => {
        if (vv && typeof vv === 'object' && vv.generated && vv.id) {
          value[vKey][vi] = apolloStateToObject(state, vv.id);
        }
      });
    } else if (typeof vValue === 'object') {
      if (vValue.generated && vValue.id) {
        value[vKey] = apolloStateToObject(state, vValue.id);
      } else if (vValue.type === 'json') {
        value[vKey] = vValue.json;
      }
    }
  });
  return value;
};
