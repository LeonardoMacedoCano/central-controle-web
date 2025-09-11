import axios, { AxiosResponse } from 'axios';
import { ContextMessageProps } from '../contexts/message/ContextMessageProvider';

interface ApiResponse {
  success?: string;
  error?: string;
}

const api = axios.create({
  baseURL: '/api',
});

const handleErrorMessage = (
  contextMessage: ContextMessageProps, 
  error: any, 
  defaultMessage: string
) => {
  const errorMessage = error.response?.data?.error || defaultMessage;
  contextMessage.showError(errorMessage);
};

const handleSuccessMessage = (
  contextMessage: ContextMessageProps, 
  response: AxiosResponse<ApiResponse>
) => {
  const successMessage = response?.data?.success;
  if (successMessage) {
    contextMessage.showSuccess(successMessage);
  }
};

export const RequestApi = async <T>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  token?: string,
  contextMessage?: ContextMessageProps,
  data?: Record<string, any>,
  responseType: 'json' | 'blob' = 'json'
): Promise<T | undefined> => {
  try {
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    const config = { headers, data, responseType };

    const response = await api.request({
      method,
      url,
      ...config,
    });

    if (contextMessage) { 
      handleSuccessMessage(contextMessage, response);
    }
    
    return response.data as T;
  } catch (error: any) {
    if (contextMessage) {
      handleErrorMessage(contextMessage, error, `Erro na requisição ${method.toUpperCase()} para ${url}`);
    }
    return undefined;
  }
};

const DefaultService = () => {
  return {
    request: RequestApi
  };
};

export default DefaultService;
