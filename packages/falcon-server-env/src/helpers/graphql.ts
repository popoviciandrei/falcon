import {
  DocumentNode,
  Kind,
  parse,
  GraphQLType,
  GraphQLNamedType,
  GraphQLResolveInfo,
  GraphQLObjectType,
  GraphQLOutputType,
  isScalarType,
  isWrappingType,
  ResponsePath
} from 'graphql';

export const PATH_SEPARATOR: string = '.';
export const TAG_SEPARATOR: string = ':';
export const PARENT_KEYWORD: string = '$parent';

export type RootFieldTypes = Record<string, string[]>;

export interface RootTypeFieldsFn {
  (typeDefs: string): RootFieldTypes;
  (typeDefs: Array<string>): RootFieldTypes;
}

export const getRootTypeFields: RootTypeFieldsFn = (typeDefs: string | Array<string>): RootFieldTypes => {
  const result: RootFieldTypes = {};
  if (!typeDefs) {
    return result;
  }
  const combinedTypeDefs: string = Array.isArray(typeDefs) ? typeDefs.join('\n') : typeDefs;

  try {
    const docNode: DocumentNode = parse(combinedTypeDefs);
    docNode.definitions.forEach(definition => {
      if (definition.kind !== Kind.OBJECT_TYPE_DEFINITION && definition.kind !== Kind.OBJECT_TYPE_EXTENSION) {
        return;
      }

      const typeName: string = definition.name.value;
      if (!['Query', 'Mutation'].includes(typeName)) {
        return;
      }

      if (definition.fields) {
        definition.fields.forEach(field => {
          const fieldName = field.name.value;
          if (!(typeName in result)) {
            result[typeName] = [];
          }

          if (!result[typeName].includes(fieldName)) {
            result[typeName].push(fieldName);
          }
        });
      }
    });
  } catch (error) {
    error.message = `Failed to get root type fields - ${error.message}`;
    throw error;
  }

  return result;
};

/**
 * Generates a path-like string for the provided request
 * for `query { foo { bar } }` - it will generate `foo.bar` string
 * @param node Operation path object
 * @returns {string} Generated operation path string
 */
export const getOperationPath = (node: ResponsePath): string => {
  const { key, prev } = node;
  const keys = [key];
  if (prev) {
    keys.unshift(getOperationPath(prev));
  }
  return keys.join(PATH_SEPARATOR);
};

/**
 * Extract "root" type from GQL field by getting "ofType" sub-type until it reaches the root field
 * @param type GQL Object type
 * @returns {GraphQLType} "root" object type
 */
export const getRootType = (type: GraphQLOutputType): GraphQLType => {
  const realType: GraphQLType = isWrappingType(type) ? type.ofType : type;
  return isWrappingType(realType) ? getRootType(realType as GraphQLOutputType) : realType;
};

declare interface GetFieldValueFn {
  (sourceValue: object, fieldName: string): undefined | object | string;
  (sourceValue: Array<object>, fieldName: string): undefined | object[] | string[];
}

/**
 * Extract a value by `fieldName` from the provided `sourceValue`
 * @param sourceValue Source object to get a field value from
 * @param fieldName Name of the field
 * @returns {string} Value or list of values (in case of `sourceValue` is an array)
 */
export const getFieldValue: GetFieldValueFn = (sourceValue: object | Array<object>, fieldName: string) => {
  if (!sourceValue || !fieldName) {
    return undefined;
  }
  if (Array.isArray(sourceValue)) {
    return sourceValue.map(item => getFieldValue(item, fieldName));
  }

  return fieldName in sourceValue ? sourceValue[fieldName] : undefined;
};

/**
 * Find a field name with `@cacheId` directive applied
 * @param gqlType GQL Object Type
 * @returns {string | undefined} Name of the "ID" field or `undefined` if there is none
 */
export const findIdFieldName = (gqlType: GraphQLOutputType): string | undefined => {
  const rootType = getRootType(gqlType);
  const { name: objectTypeName } = rootType as GraphQLNamedType;

  if (isScalarType(gqlType)) {
    throw new Error(`Caching for "${objectTypeName}" scalar type is not supported yet`);
  }

  const fields = (rootType as GraphQLObjectType).getFields();
  const idFields = Object.keys(fields).filter(
    fieldName => !!fields[fieldName].astNode.directives.find(directive => directive.name.value === 'cacheId')
  );

  if (idFields.length > 1) {
    throw new Error(
      `Misuse of "@cacheId" directive, only 1 field in ${objectTypeName} type can have this directive, currently being used by: ${idFields.join(
        ', '
      )}`
    );
  }

  return idFields.length ? idFields[0] : undefined;
};

/**
 * Generate tag names using `entityName` and `entityId`
 * @param entityName Entity Type name (like "Product")
 * @param entityId Entity ID or list of IDs (like: "1" or ["1", "2"])
 * @returns {string[]} List of tag names (example: ["Product:1", "Product:2"])
 */
export const generateTagNames = (entityName: string, entityId: string | string[]): string[] => {
  if (!entityId) {
    return [];
  }
  const ids = Array.isArray(entityId) ? entityId.filter(element => element) : [entityId];
  return ids.map(id => `${entityName}${TAG_SEPARATOR}${id}`);
};

/**
 * Get a list of tags from the provided `sourceValue` using specified `fieldType` and `fieldPathSections` (for nested values)
 * @param sourceValue Source value to get tags from
 * @param fieldType GraphQL Field Type object
 * @param [fieldPathSections=[]] An optional field path sections (example: `["products", "items"]` which are created from a relative `products.items` field path)
 * that are going to be used to get tags from. If not passed or empty - tags will be received from `sourceValue` directly.
 * @param forceTypeName type name to force as a tag name
 * @returns {string[]} List of tag names
 */
export const getTagsForField = (
  sourceValue: object,
  fieldType: GraphQLOutputType,
  fieldPathSections: string[] = [],
  forceTypeName?: string
): string[] => {
  const rootType = getRootType(fieldType) as GraphQLObjectType;
  if (!fieldPathSections.length) {
    const { name: typeName } = rootType;
    return generateTagNames(forceTypeName || typeName, getFieldValue(sourceValue, findIdFieldName(fieldType)) as
      | string
      | string[]);
  }

  const [currentPath, ...restIdPath] = fieldPathSections;
  const fields = rootType.getFields();
  let { name: typeName } = rootType;
  let fieldValue = getFieldValue(sourceValue, currentPath);

  // Keep looking for nested ID path until it reaches the end node
  if (currentPath && restIdPath.length) {
    return getTagsForField(
      fieldValue as object,
      getRootType(fields[currentPath].type) as GraphQLOutputType,
      restIdPath
    );
  }
  if (Array.isArray(fieldValue)) {
    const currentType = getRootType(fields[currentPath].type);
    typeName = (currentType as GraphQLNamedType).name;
    const currentCacheIdFieldName = findIdFieldName(currentType as GraphQLOutputType);
    fieldValue = getFieldValue(fieldValue, currentCacheIdFieldName);
  }
  typeName = forceTypeName || typeName;

  return [typeName, ...generateTagNames(typeName, fieldValue as string)];
};

/**
 * Extract cache tags for the provided ID path and return a list of tags
 * @param idPath ID operation path string (like "$parent.items" or "items")
 * @param result Resolver result
 * @param info GraphQL info object
 * @param parent GraphQL parent object
 * @param forceTypeName type name to force as a tag name
 * @returns {string[]} List of tags
 */
export const extractTagsForIdPath = (
  idPath: string,
  result: object,
  info: GraphQLResolveInfo,
  parent: object,
  forceTypeName?: string
): string[] => {
  const [rootPath, ...fieldPathSections] = idPath.split(PATH_SEPARATOR);
  const valueToCheck = rootPath === PARENT_KEYWORD ? parent : result;
  const typeToCheck = getRootType(rootPath === PARENT_KEYWORD ? info.parentType : info.returnType);
  if (rootPath !== PARENT_KEYWORD) {
    // Put first path section back to "fieldPathSections" for non-parent entries
    fieldPathSections.unshift(rootPath);
  }

  return getTagsForField(valueToCheck, typeToCheck as GraphQLOutputType, fieldPathSections, forceTypeName);
};
