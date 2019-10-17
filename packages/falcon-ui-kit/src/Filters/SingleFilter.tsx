import React from 'react';
import { FilterOption } from '@deity/falcon-front-kit';
import { FilterItemListLayout, FilterItemListLayoutProps } from './FilterItemListLayout';
import { FilterItemLayout } from './FilterItemLayout';
import { SelectedFilterItemLayout } from './SelectedFilterItemLayout';

export type SingleFilterProps = {
  options: FilterOption[];
  selected?: string;
  onChange: (value?: string) => void;
};
export const SingleFilter: React.SFC<SingleFilterProps & FilterItemListLayoutProps> = ({
  options,
  selected,
  onChange,
  ...rest
}) => {
  const selectedOption = selected !== undefined ? options.find(x => x.value === selected) : undefined;

  return (
    <FilterItemListLayout {...rest}>
      {selectedOption && (
        <SelectedFilterItemLayout onClick={() => onChange()}>{selectedOption!.title}</SelectedFilterItemLayout>
      )}
      {!selectedOption &&
        options.map(x => (
          <FilterItemLayout key={x.value} onClick={() => onChange(x.value)}>
            {x.title} ({x.count})
          </FilterItemLayout>
        ))}
    </FilterItemListLayout>
  );
};
