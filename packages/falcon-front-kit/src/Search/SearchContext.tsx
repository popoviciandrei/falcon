import React from 'react';
import { SearchContextValue } from './SearchContextValue';

export const SearchContext = React.createContext<SearchContextValue>({
  state: {
    filters: []
  },
  setTerm: () => {},
  setFilter: () => {},
  removeFilter: () => {},
  removeFilters: () => {},
  setSortOrder: () => {},
  setPagination: () => {}
});
