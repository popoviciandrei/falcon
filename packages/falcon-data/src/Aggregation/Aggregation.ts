export type Aggregation = {
  field: string;
  type: SelectionType;
  buckets: AggregationBucket[];
  title: string;
};

export type SelectionType = 'single' | 'multiple' | 'range';

export type AggregationBucket = {
  value: string;
  count: number;
  title: string;
};
