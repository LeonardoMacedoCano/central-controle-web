import { useState, useEffect, useRef } from 'react';
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

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const messageRef = useRef(message);
  messageRef.current = message;
  const errorMessageRef = useRef(errorMessage);
  errorMessageRef.current = errorMessage;

  useEffect(() => {
    if (!token || !id) return;
    setIsLoading(true);
    fetcherRef.current(token, id)
      .then(result => { if (result) setData(result); })
      .catch(error => messageRef.current.showErrorWithLog(errorMessageRef.current, error))
      .finally(() => setIsLoading(false));
  }, [token, id]);

  return { data, isLoading };
}
