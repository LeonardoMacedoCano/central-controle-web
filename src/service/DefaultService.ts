import axios, { AxiosResponse } from 'axios';
import { MICROSERVICES, MicroserviceKey } from './Api';
import { ContextMessageProps } from 'lcano-react-ui';

export const RequestApi = async <T>(
  service: MicroserviceKey,
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  token?: string,
  contextMessage?: ContextMessageProps,
  data?: Record<string, any>,
  responseType: 'json' | 'blob' = 'json'
): Promise<T | undefined> => {
  const { url: baseUrl } = MICROSERVICES[service];
  const api = axios.create({ baseURL: baseUrl });

  try {
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    const config = { headers, data, responseType };

    const response: AxiosResponse<T> = await api.request({ method, url, ...config });

    if (contextMessage) {
      const successMessage = (response.data as any)?.success;
      if (successMessage) contextMessage.showSuccess(successMessage);
    }

    return response.data;
  } catch (error: any) {
    if (contextMessage) {
      const errorMessage =
        error.response?.data?.error || `Erro na requisição ${method.toUpperCase()} para ${url}`;
      contextMessage.showError(errorMessage);
    }
    return undefined;
  }
};

export default { request: RequestApi };
