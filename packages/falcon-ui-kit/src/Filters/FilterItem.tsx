import React from 'react';
import { AggregationBucket } from '@deity/falcon-data';
import { FilterItemLayout } from './FilterItemLayout';

export type FilterItemProps = {
  item: AggregationBucket;
  onClick?: (event: React.MouseEvent) => void;
};

export const FilterItem: React.SFC<FilterItemProps> = ({ item, onClick }) => (
  <FilterItemLayout onClick={onClick}>
    {item.title} ({item.count})
  </FilterItemLayout>
);
