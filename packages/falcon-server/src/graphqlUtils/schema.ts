import { DocumentNode, Kind, parse } from 'graphql';

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
