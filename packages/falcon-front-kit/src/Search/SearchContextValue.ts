import { SortOrderValue, PaginationInput } from '@deity/falcon-data';
import { FilterOperator } from '@deity/falcon-shop-extension';
import { SearchState } from './searchState';

export type SearchContextValue = {
  state: SearchState;
  setFilter(name: string, value: string[], operator?: FilterOperator): void;
  removeFilter(name: string): void;
  removeFilters(): void;
  setSortOrder(sort?: SortOrderValue): void;
  setTerm(term: string): void;
  setPagination(pagination: PaginationInput): void;
};
