/**
 * The ID scalar type represents a unique identifier, often used to refetch an object or as the key for a cache.
 * The ID type is serialized in the same way as a String; however, defining it as an ID signifies that it is not intended to be human‐readable.
 * @see https://graphql.org/learn/schema/#scalar-types */
export type ID = number | string;
