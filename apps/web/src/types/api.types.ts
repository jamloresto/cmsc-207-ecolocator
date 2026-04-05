export type SortOrder = 'asc' | 'desc';

export type PaginationParams = {
  page?: number;
  per_page?: number;
};

export type SearchParams = {
  search?: string;
};

export type SortDirectionParams<TSortField extends string = string> = {
  sort?: TSortField;
  direction?: SortOrder;
};

export type SortOrderParams<TSortField extends string = string> = {
  sort_by?: TSortField;
  sort_order?: SortOrder;
};

export type ValidationErrors = Record<string, string[]>;

export type ApiSuccessResponse<T> = {
  data: T;
};

export type ApiErrorResponse = {
  message?: string;
  errors?: ValidationErrors;
};

export type PaginatedResponse<T> = {
  data: T[];
  links: {
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
};
