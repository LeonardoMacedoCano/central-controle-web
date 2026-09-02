import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { MICROSERVICES, MicroserviceKey } from './Api';
import { ContextMessageProps } from 'lcano-react-ui';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

const handleExpiredSession = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('authToken');
  if (window.location.pathname !== '/') {
    window.location.assign('/');
  } else {
    window.location.reload();
  }
};

export const RequestApi = async <T>(
  service: MicroserviceKey,
  method: HttpMethod,
  url: string,
  token?: string,
  contextMessage?: ContextMessageProps,
  data?: unknown,
  responseType: 'json' | 'blob' = 'json'
): Promise<T | undefined> => {
  const { url: baseUrl } = MICROSERVICES[service];
  const api = axios.create({ baseURL: baseUrl });

  try {
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    const config: AxiosRequestConfig = { method, url, headers, responseType };
    if (method !== 'get' && data !== undefined) {
      config.data = data;
    }

    const response: AxiosResponse<T> = await api.request(config);

    if (contextMessage) {
      const successMessage = (response.data as { success?: string } | undefined)?.success;
      if (successMessage) contextMessage.showSuccess(successMessage);
    }

    return response.data;
  } catch (error) {
    const axiosError = axios.isAxiosError(error) ? error : undefined;
    const status = axiosError?.response?.status;

    if (token && status === 401) {
      handleExpiredSession();
      return undefined;
    }

    if (contextMessage) {
      const errorMessage =
        (axiosError?.response?.data as { error?: string } | undefined)?.error ||
        `Erro na requisição ${method.toUpperCase()} para ${url}`;
      contextMessage.showError(errorMessage);
    }
    return undefined;
  }
};

export default { request: RequestApi };
