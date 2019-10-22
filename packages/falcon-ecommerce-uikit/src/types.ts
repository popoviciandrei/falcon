export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type PaginationQuery = {
  pagination: PaginationInput;
};

export type PaginationInput = {
  perPage: number;
  page: number;
};

export type Pagination = {
  totalPages: number;
  totalItems: number;
  perPage: number;
  currentPage: number;
  nextPage: number;
  prevPage: number;
};
