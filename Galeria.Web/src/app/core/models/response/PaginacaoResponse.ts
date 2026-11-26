export interface PaginacaoResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  totalItems: number;
}
