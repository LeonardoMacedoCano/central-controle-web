import { useState, useEffect, useCallback } from 'react';
import { PAGE_SIZE_DEFAULT, PagedResponse, useMessage } from 'lcano-react-ui';

type PagedFetcher<T> = (
  token: string,
  page: number,
  size: number,
  rsql?: string
) => Promise<PagedResponse<T> | undefined>;

export function usePagedData<T>(
  token: string | undefined,
  fetcher: PagedFetcher<T>,
  errorMessage: string
) {
  const [data, setData] = useState<PagedResponse<T>>();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
  const [isLoading, setIsLoading] = useState(false);
  const message = useMessage();

  const load = useCallback(async (page = pageIndex, size = pageSize, rsql = '') => {
    if (!token) return;
    setIsLoading(true);
    try {
      const result = await fetcher(token, page, size, rsql);
      setData(result);
    } catch (error) {
      message.showErrorWithLog(errorMessage, error);
    } finally {
      setIsLoading(false);
    }
  }, [token, fetcher, pageIndex, pageSize, errorMessage, message]);

  useEffect(() => {
    if (token) load();
  }, [token, pageIndex, load]);

  const loadPage = (page: number, size: number) => {
    setPageIndex(page);
    setPageSize(size);
  };

  return { data, isLoading, load, loadPage };
}
