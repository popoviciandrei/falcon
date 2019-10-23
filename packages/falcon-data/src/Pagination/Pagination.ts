export type Pagination = {
  totalPages: number;
  totalItems: number;
  perPage: number;
  currentPage: number;
  nextPage: number;
  prevPage: number;
};

export type PaginationQuery = {
  pagination: PaginationInput;
};

export type PaginationInput = {
  perPage: number;
  page: number;
};
