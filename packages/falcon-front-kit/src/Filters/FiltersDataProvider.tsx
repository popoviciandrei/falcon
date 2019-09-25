import React from 'react';
import { Aggregation } from '@deity/falcon-data';
import { FilterOperator, FilterInput } from '@deity/falcon-shop-extension';
import { SearchConsumer } from '../Search';
import { FilterData, FilterOption, aggregationToFilterData } from './FilterData';

export const getFiltersData = (
  filters: FilterInput[],
  aggregations: Aggregation[] = [],
  filterData: FilterData[] = []
): FilterData[] =>
  [...[], ...aggregations.map(x => aggregationToFilterData(x)), ...filterData].map(x => {
    const selected = filters.find(filter => filter.field === x.field);

    return {
      ...x,
      value: selected ? selected.value : []
    };
  });

export const getSelectedFilterOptionsFor = (data: FilterData[], field: string) => {
  const filter = data.find(x => x.field === field);

  if (filter === undefined) {
    return [];
  }
  const { options, value } = filter;

  return options.filter(option => value.some(x => x === option.value));
};

export type FiltersDataProviderRenderProps = {
  filters: FilterData[];
  anySelected: boolean;
  getSelectedFilterOptionsFor: (data: FilterData[], field: string) => FilterOption[];
  setFilter(name: string, value: string[], operator?: FilterOperator): void;
  removeFilter(name: string): void;
  removeFilters(): void;
};

export type FiltersDataProviderProps = {
  aggregations?: Aggregation[];
  data?: FilterData[];
  children: (renderProps: FiltersDataProviderRenderProps) => React.ReactNode;
};

export const FiltersDataProvider: React.SFC<FiltersDataProviderProps> = ({ children, aggregations, data }) => (
  <SearchConsumer>
    {({ state: { filters }, setFilter, removeFilter, removeFilters }) =>
      children({
        filters: getFiltersData(filters, aggregations || [], data || []),
        anySelected: filters.length > 0,
        getSelectedFilterOptionsFor,
        setFilter,
        removeFilter,
        removeFilters
      })
    }
  </SearchConsumer>
);
