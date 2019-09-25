import React from 'react';
import { SearchConsumer, FilterData, getSelectedFilterOptionsFor } from '@deity/falcon-front-kit';
import { SelectedFilterItemLayout } from './SelectedFilterItemLayout';
import { SelectedFilterList } from './SelectedFilterList';

export type FiltersSummaryProps = {
  data: FilterData[];
};

export const FiltersSummary: React.SFC<FiltersSummaryProps> = ({ data }) => (
  <SearchConsumer>
    {({ state: { filters }, removeFilter }) => {
      if (!filters.length) {
        return null;
      }

      return (
        <SelectedFilterList>
          {data.map(({ field, title }) => {
            const selectedFilterOptions = getSelectedFilterOptionsFor(data, field);

            if (selectedFilterOptions.length === 0) {
              return null;
            }

            return (
              <SelectedFilterItemLayout key={field} onClick={() => removeFilter(field)}>
                {title}: {selectedFilterOptions.map(x => x.title || x.value).join(', ')}
              </SelectedFilterItemLayout>
            );
          })}
        </SelectedFilterList>
      );
    }}
  </SearchConsumer>
);
