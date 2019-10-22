import React from 'react';
import { Box, themed } from '@deity/falcon-ui';
import { Aggregation, SelectionType } from '../Category';
import { SearchConsumer, FilterOperator, FilterInput } from '../Search';

export type FilterData = {
  field: string;
  title: string;
  type: SelectionType;
  options: FilterOption[];
  value: string[];
};

export type FilterOption = {
  title: string;
  value: string;
  count: number;
};

export const aggregationToFilterData = (aggregation: Aggregation): FilterData => ({
  field: aggregation.field,
  title: aggregation.title,
  type: aggregation.type,
  options: aggregation.buckets,
  value: []
});

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

export const FiltersLayout = themed({
  tag: Box,
  defaultTheme: {
    filtersPanelLayout: {
      display: 'grid',
      gridGap: 'sm',
      css: {
        width: '100%',
        alignContent: 'start'
      }
    }
  }
});

export type FilterDataProviderRenderProps = {
  filters: FilterData[];
  anySelected: boolean;
  getSelectedFilterOptionsFor: (data: FilterData[], field: string) => FilterOption[];
  setFilter(name: string, value: string[], operator?: FilterOperator): void;
  removeFilter(name: string): void;
  removeFilters(): void;
};

export const FiltersDataProvider: React.SFC<{
  aggregations?: Aggregation[];
  data?: FilterData[];
  children: (renderProps: FilterDataProviderRenderProps) => React.ReactNode;
}> = ({ children, aggregations, data }) => (
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
