import { useState, useEffect } from 'react';
import { useMessage } from 'lcano-react-ui';

type FetcherById<T> = (token: string, id: string) => Promise<T | undefined>;

export function useFetchById<T>(
  token: string | undefined,
  id: string | undefined,
  fetcher: FetcherById<T>,
  errorMessage: string
) {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const message = useMessage();

  useEffect(() => {
    if (!token || !id) return;
    setIsLoading(true);
    fetcher(token, id)
      .then(result => { if (result) setData(result); })
      .catch(error => message.showErrorWithLog(errorMessage, error))
      .finally(() => setIsLoading(false));
  }, [token, id, fetcher, errorMessage, message]);

  return { data, isLoading };
}
