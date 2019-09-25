import React from 'react';
import { SortOrder } from '@deity/falcon-data';
import { BackendConfigQuery } from '@deity/falcon-shop-data';
import { SearchConsumer } from '../Search/SearchConsumer';
import { areSortOrderInputsEqual } from './areSortOrderInputsEqual';

export type SortOrderPickerProviderRenderProps = {
  items: SortOrder[];
  value: SortOrder;
  onChange(active: SortOrder): void;
};

export type SortOrderPickerProviderProps = {
  children(props: SortOrderPickerProviderRenderProps): any;
};
export const SortOrderPickerProvider: React.SFC<SortOrderPickerProviderProps> = ({ children }) => (
  <BackendConfigQuery>
    {({ data: { backendConfig } }) => {
      const { sortOrderList } = backendConfig.shop;

      return (
        <SearchConsumer>
          {({ state: { sort }, setSortOrder }) =>
            children({
              items: sortOrderList,
              value: sortOrderList.find(x => (!x.value && !sort) || areSortOrderInputsEqual(x.value, sort))!,
              onChange: x => setSortOrder(x.value)
            })
          }
        </SearchConsumer>
      );
    }}
  </BackendConfigQuery>
);
