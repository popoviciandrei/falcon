export type FilterInput = {
  field: string;
  operator: FilterOperator;
  value: string[];
};

export enum FilterOperator {
  /** can bee used also as `inSet`, when array is passed */
  equals = 'eq',
  /** can be used as `notInSet` when array is passed */
  notEquals = 'neq',
  lessThan = 'lt',
  lessThanOrEquals = 'lte',
  greaterThan = 'gt',
  greaterThanOrEquals = 'gte',
  /** in the set */
  inSet = 'in',
  /** not in the set */
  notInSet = 'nin',
  /** in the range */
  range = 'range'
}
