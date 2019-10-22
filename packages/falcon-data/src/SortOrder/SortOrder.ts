export type SortOrder = {
  name: string;
  value?: SortOrderValue;
};

export type SortOrderValue = {
  field: string;
  direction: SortOrderDirection;
};

export type SortOrderDirection = 'asc' | 'desc';
