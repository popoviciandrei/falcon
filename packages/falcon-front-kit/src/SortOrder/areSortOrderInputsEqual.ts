import { SortOrderValue } from '@deity/falcon-data';

/**
 * Determines if two `SortOrderValue` are equal from a value perspective
 * @param item1
 * @param item2
 */
export const areSortOrderInputsEqual = (item1?: SortOrderValue, item2?: SortOrderValue): boolean =>
  !!item1 && !!item2 && item1.field === item2.field && item1.direction === item2.direction;
