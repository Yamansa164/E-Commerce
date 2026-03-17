export type PaginationParams = {
  page?: number;
  perPage?: number;
  maxPerPage?: number;
};

export type PaginationMeta = {
  total: number;
  currentPage: number;
  perPage: number;
  pageCount: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

export function normalizePagination(params: PaginationParams = {}) {
  const maxPerPage = params.maxPerPage ?? 100;
  const page = Math.max(1, Math.trunc(params.page ?? 1));
  const perPage = Math.min(
    maxPerPage,
    Math.max(1, Math.trunc(params.perPage ?? 10)),
  );

  return { page, perPage, skip: (page - 1) * perPage, take: perPage };
}

export function buildPaginationMeta(args: {
  total: number;
  page: number;
  perPage: number;
}): PaginationMeta {
  const { total, page, perPage } = args;
  const pageCount = Math.ceil(total / perPage);
  const hasPrevPage = page > 1;
  const hasNextPage = page < pageCount;

  return {
    total,
    currentPage: page,
    perPage,
    pageCount,
    hasPrevPage,
    hasNextPage,
    prevPage: hasPrevPage ? page - 1 : null,
    nextPage: hasNextPage ? page + 1 : null,
  };
}
