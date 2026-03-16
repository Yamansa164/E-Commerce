import {
  buildPaginationMeta,
  normalizePagination,
  type PaginationMeta,
  type PaginationParams,
} from './pagination';

export type BaseResponse<TData> = {
  message: string;
  data: TData;
  success: boolean;
  meta: PaginationMeta | null;
};

export function ok<TData>(args: {
  message?: string;
  data: TData;
  meta?: PaginationMeta | null;
}): BaseResponse<TData> {
  return {
    success: true,
    message: args.message ?? 'success',
    data: args.data,
    meta: args.meta ?? null,
  };
}

export function fail<TData>(args: {
  message?: string;
  data: TData;
  meta?: PaginationMeta | null;
}): BaseResponse<TData> {
  return {
    success: false,
    message: args.message ?? 'error',
    data: args.data,
    meta: args.meta ?? null,
  };
}

export function paginatedOk<TData>(args: {
  message?: string;
  data: TData;
  total: number;
  page: number;
  perPage: number;
}): BaseResponse<TData> {
  const meta = buildPaginationMeta({
    total: args.total,
    page: args.page,
    perPage: args.perPage,
  });

  return ok({
    message: args.message ?? 'success',
    data: args.data,
    meta,
  });
}

