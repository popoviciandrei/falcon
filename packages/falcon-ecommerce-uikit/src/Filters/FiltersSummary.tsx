import React from 'react';
import { Box, List, themed } from '@deity/falcon-ui';
import { SearchConsumer } from '../Search';
import { SelectedFilterItem } from './FilterItem';
import { getSelectedFilterOptionsFor, FilterData } from './FiltersDataProvider';

export const FiltersSummaryLayout = themed({
  tag: Box,
  defaultTheme: {
    filtersSummaryLayout: {}
  }
});

type FiltersSummaryProps = {
  data: FilterData[];
};

export const FiltersSummary: React.SFC<FiltersSummaryProps> = ({ data }) => (
  <SearchConsumer>
    {({ state: { filters }, removeFilter }) => {
      if (!filters.length) {
        return null;
      }

      return (
        <FiltersSummaryLayout>
          <List>
            {data.map(({ field, title }) => {
              const selectedFilterOptions = getSelectedFilterOptionsFor(data, field);

              if (selectedFilterOptions.length === 0) {
                return null;
              }

              return (
                <SelectedFilterItem key={field} onClick={() => removeFilter(field)}>
                  {title}: {selectedFilterOptions.map(x => x.title || x.value).join(', ')}
                </SelectedFilterItem>
              );
            })}
          </List>
        </FiltersSummaryLayout>
      );
    }}
  </SearchConsumer>
);
