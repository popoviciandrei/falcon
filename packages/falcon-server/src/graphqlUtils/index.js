const { isScalarType } = require('graphql');

/**
 * @typedef {import('graphql').GraphQLType} GraphQLType
 * @typedef {import('graphql').ResponsePath} ResponsePath
 * @typedef {import('graphql').GraphQLResolveInfo} GraphQLResolveInfo
 */

const PATH_SEPARATOR = '.';
const ID_FIELD_TYPE = 'ID';
const TAG_SEPARATOR = ':';
const PARENT_KEYWORD = '$parent';

/**
 * Generates a path-like string for the provided request
 * for `query { foo { bar } }` - it will generate `foo.bar` string
 * @param {ResponsePath} node Operation path object
 * @returns {string} Generated operation path string
 */
const getOperationPath = node => {
  const { key, prev } = node;
  const keys = [key];
  if (prev) {
    keys.unshift(getOperationPath(prev));
  }
  return keys.join(PATH_SEPARATOR);
};

/**
 * Extract "root" type from GQL field by getting "ofType" sub-type until it reaches the root field
 * @param {GraphQLType} type GQL Object type
 * @returns {GraphQLType} "root" object type
 */
const getRootType = type => {
  const realType = type.ofType || type;
  return realType.ofType ? getRootType(realType) : realType;
};

/**
 * Extract a value by `fieldName` from the provided `sourceValue`
 * @param {Object|Array<Object>} sourceValue Source object to get a field value from
 * @param {string} fieldName Name of the field
 * @returns {undefined|string|string[]} Value or list of values (in case of `sourceValue` is an array)
 */
const getFieldValue = (sourceValue, fieldName) => {
  if (!sourceValue || !fieldName) {
    return undefined;
  }
  if (Array.isArray(sourceValue)) {
    return sourceValue.map(item => getFieldValue(item, fieldName));
  }

  return fieldName in sourceValue ? sourceValue[fieldName] : undefined;
};

/**
 * Find a field name with ID_FIELD_TYPE type
 * @param {GraphQLType} gqlType GQL Object Type
 * @returns {string|undefined} Name of the field with
 */
const findIdFieldName = gqlType => {
  const { _fields: fields, name: objectTypeName } = getRootType(gqlType);
  if (isScalarType(gqlType)) {
    throw new Error(`Caching for "${objectTypeName}" scalar type is not supported yet`);
  }

  return Object.keys(fields).find(fieldName => {
    const { [fieldName]: fieldType } = fields;
    const { name } = getRootType(fieldType.type);
    return name === ID_FIELD_TYPE;
  });
};

/**
 * Generate tag names using `entityName` and `entityId`
 * @param {string} entityName Entity Type name (like "Product")
 * @param {string|string[]} entityId Entity ID or list of IDs (like: "1" or ["1", "2"])
 * @returns {string[]} List of tag names (example: ["Product:1", "Product:2"])
 */
const generateTagNames = (entityName, entityId) => {
  if (!entityId) {
    return [];
  }
  const ids = Array.isArray(entityId) ? entityId.filter(element => element) : [entityId];
  return ids.map(id => `${entityName}${TAG_SEPARATOR}${id}`);
};

/**
 * Get a list of tags from the provided `sourceValue` using specified `fieldType` and `fieldPathSections` (for nested values)
 * @param {Object} sourceValue Source value to get tags from
 * @param {GraphQLType} fieldType GraphQL Field Type object
 * @param {string[]} [fieldPathSections=[]] An optional field path sections (example: `["products", "items"]` which are created from a relative `products.items` field path)
 * that are going to be used to get tags from. If not passed or empty - tags will be received from `sourceValue` directly.
 * @param {string|undefined} forceTypeName type name to force as a tag name
 * @returns {string[]} List of tag names
 */
const getTagsForField = (sourceValue, fieldType, fieldPathSections = [], forceTypeName = undefined) => {
  if (!fieldPathSections.length) {
    const { name: typeName } = getRootType(fieldType);
    return generateTagNames(forceTypeName || typeName, getFieldValue(sourceValue, findIdFieldName(fieldType)));
  }

  const [currentPath, ...restIdPath] = fieldPathSections;
  const fields = fieldType.getFields();
  let { name: typeName } = fieldType;
  let fieldValue = getFieldValue(sourceValue, currentPath);

  // Keep looking for nested ID path until it reaches the end node
  if (currentPath && restIdPath.length) {
    return getTagsForField(fieldValue, getRootType(fields[currentPath].type), restIdPath);
  }
  if (Array.isArray(fieldValue)) {
    const currentType = getRootType(fields[currentPath].type);
    typeName = currentType.name;
    const currentCacheIdFieldName = findIdFieldName(currentType);
    fieldValue = getFieldValue(fieldValue, currentCacheIdFieldName);
  }
  typeName = forceTypeName || typeName;

  return [typeName, ...generateTagNames(typeName, fieldValue)];
};

/**
 * Extract cache tags for the provided ID path and return a list of tags
 * @param {string} idPath ID operation path string (like "$parent.items" or "items")
 * @param {Object} result Resolver result
 * @param {GraphQLResolveInfo} info GraphQL info object
 * @param {Object} parent GraphQL parent object
 * @param {string|undefined} forceTypeName type name to force as a tag name
 * @returns {string[]} List of tags
 */
const extractTagsForIdPath = (idPath, result, info, parent, forceTypeName = undefined) => {
  const [rootPath, ...fieldPathSections] = idPath.split(PATH_SEPARATOR);
  const valueToCheck = rootPath === PARENT_KEYWORD ? parent : result;
  const typeToCheck = getRootType(rootPath === PARENT_KEYWORD ? info.parentType : info.returnType);
  if (rootPath !== PARENT_KEYWORD) {
    // Put first path section back to "fieldPathSections" for non-parent entries
    fieldPathSections.unshift(rootPath);
  }

  return getTagsForField(valueToCheck, typeToCheck, fieldPathSections, forceTypeName);
};

module.exports = {
  PATH_SEPARATOR,
  ID_FIELD_TYPE,
  PARENT_KEYWORD,
  getRootType,
  getOperationPath,
  getFieldValue,
  getTagsForField,
  generateTagNames,
  extractTagsForIdPath,
  findIdFieldName
};
