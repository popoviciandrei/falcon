import React from 'react';
import { SortOrdersQuery, SortOrder, AreSortOrderInputsEqual } from './SortOrdersQuery';
import { SearchConsumer } from '../Search';

type SortOrdersProviderRenderProps = {
  items: SortOrder[];
  value: SortOrder;
  onChange(active: SortOrder): void;
};

type SortOrdersProviderProps = {
  children(props: SortOrdersProviderRenderProps): any;
};

export const SortOrdersProvider: React.SFC<SortOrdersProviderProps> = ({ children }) => (
  <SortOrdersQuery>
    {({ sortOrders }) => (
      <SearchConsumer>
        {({ state: { sort }, setSortOrder }) =>
          children({
            items: sortOrders,
            value: sortOrders.find(x => (!x.value && !sort) || AreSortOrderInputsEqual(x.value, sort))!,
            onChange: x => setSortOrder(x.value)
          })
        }
      </SearchConsumer>
    )}
  </SortOrdersQuery>
);
