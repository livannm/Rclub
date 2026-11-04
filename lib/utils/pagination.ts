export const EVENT_PAGE_SIZE = 5;
export const ALBUM_PAGE_SIZE = 5;
export const PHOTO_PAGE_SIZE = 24;

export type PaginationInfo = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  offset: number;
};

export type Paginated<T> = PaginationInfo & { items: T[] };

export function parsePage(value: unknown): number {
  if (typeof value !== "string" && typeof value !== "number") return 1;
  if (typeof value === "string" && !/^\d+$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function getPagination(total: number, pageSize: number, requestedPage: number): PaginationInfo {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(parsePage(requestedPage), totalPages);
  return { total, pageSize, totalPages, page, offset: (page - 1) * pageSize };
}

export function paginate<T>(items: T[], pageSize: number, requestedPage: number): Paginated<T> {
  const pagination = getPagination(items.length, pageSize, requestedPage);
  return { ...pagination, items: items.slice(pagination.offset, pagination.offset + pageSize) };
}

export function pageHref(path: string, query: Record<string, string>, page: number) {
  const params = new URLSearchParams(query);
  if (page > 1) params.set("page", String(page));
  else params.delete("page");
  const search = params.toString();
  return search ? `${path}?${search}` : path;
}
