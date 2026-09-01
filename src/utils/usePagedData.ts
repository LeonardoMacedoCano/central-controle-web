import { useState, useEffect, useRef } from 'react';
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
  errorMessage: string,
  initialRsql?: string
) {
  const [data, setData] = useState<PagedResponse<T>>();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
  const [isLoading, setIsLoading] = useState(false);
  const message = useMessage();

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const messageRef = useRef(message);
  messageRef.current = message;
  const errorMessageRef = useRef(errorMessage);
  errorMessageRef.current = errorMessage;
  const activeRsqlRef = useRef(initialRsql ?? '');

  const load = async (page = pageIndex, size = pageSize, rsql = activeRsqlRef.current) => {
    if (!token) return;
    activeRsqlRef.current = rsql;
    setIsLoading(true);
    try {
      const result = await fetcherRef.current(token, page, size, rsql);
      setData(result);
    } catch (error) {
      messageRef.current.showErrorWithLog(errorMessageRef.current, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    fetcherRef.current(token, pageIndex, pageSize, activeRsqlRef.current)
      .then(result => setData(result))
      .catch(error => messageRef.current.showErrorWithLog(errorMessageRef.current, error))
      .finally(() => setIsLoading(false));
  // fetcher/message/errorMessage/activeRsql são acessados via ref e não entram nas deps de propósito
  }, [token, pageIndex, pageSize]);

  const loadPage = (page: number, size: number) => {
    setPageIndex(page);
    setPageSize(size);
  };

  return { data, isLoading, load, loadPage };
}
