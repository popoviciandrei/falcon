import React from 'react';
import { ThemedComponentProps } from '@deity/falcon-ui';
import { FilterOption } from '@deity/falcon-front-kit';
import { FilterItemListLayout } from './FilterItemListLayout';
import { FilterItemLayout } from './FilterItemLayout';
import { SelectedFilterItemLayout } from './SelectedFilterItemLayout';

export type SingleFilterProps = {
  options: FilterOption[];
  selected?: string;
  onChange: (value?: string) => void;
};
export const SingleFilter: React.SFC<SingleFilterProps & ThemedComponentProps> = ({
  options,
  selected,
  onChange,
  ...rest
}) => {
  const selectedOption = selected !== undefined ? options.find(x => x.value === selected) : undefined;

  return (
    <FilterItemListLayout {...(rest as any)}>
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
