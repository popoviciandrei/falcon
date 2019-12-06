export type RecordEnumLike<TKeys extends string> = {
  [Key in TKeys]: Key;
};
