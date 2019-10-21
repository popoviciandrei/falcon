import React from 'react';
import { ColorTile } from '../Color';
import { FilterItemLayout } from './FilterItemLayout';
import { SelectedFilterItemLayout } from './SelectedFilterItemLayout';
import { FilterItemListLayout, FilterItemListLayoutProps } from './FilterItemListLayout';
import { SingleFilterProps } from './SingleFilter';

export const ColorFilter: React.SFC<SingleFilterProps & FilterItemListLayoutProps> = ({
  options,
  selected,
  onChange,
  ...rest
}) => {
  const selectedOption = selected !== undefined ? options.find(x => x.value === selected) : undefined;

  return (
    <FilterItemListLayout display="flex" flexWrap="wrap" {...rest}>
      {selectedOption && (
        <SelectedFilterItemLayout onClick={() => onChange()}>
          <ColorTile size="lg" color={selectedOption!.value} title={selectedOption!.title} />
        </SelectedFilterItemLayout>
      )}
      {!selectedOption &&
        options.map(x => (
          <FilterItemLayout key={x.value} onClick={() => onChange(x.value)}>
            <ColorTile size="lg" color={x!.value} title={x!.title} />
          </FilterItemLayout>
        ))}
    </FilterItemListLayout>
  );
};
