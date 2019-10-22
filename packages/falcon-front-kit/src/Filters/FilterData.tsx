import { SelectionType, Aggregation } from '@deity/falcon-data';

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
