import axios, {Axios, AxiosRequestConfig} from 'axios';

export type ApiClientOptions = {
  baseUrl: string
  timeout?: number
};

export type ErrorData = {
  message: string
};

const DEFAULT_OPTIONS_TIMEOUT = 1000;
const DEFAULT_OPTIONS_HEADERS = {
  Accept: 'application/json',
};

export default abstract class ApiClient {
  private m_Client: Axios;

  constructor(options: ApiClientOptions) {
    this.m_Client = axios.create({
      baseURL: options.baseUrl,
      timeout: options.timeout ?? DEFAULT_OPTIONS_TIMEOUT,
      headers: DEFAULT_OPTIONS_HEADERS
    })
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    if (!this.m_Client) {
        throw new Error('An axios client is missing!');
    }
    
    const requestConfig: AxiosRequestConfig = {
        ...config,
    };

    try {
        const response = await this.m_Client.get<T>(url, requestConfig);
        return response.data;
    } catch (error) {
      let errorData: ErrorData = {
          message: (error as Error).message,
      };

      if (axios.isAxiosError(error) && error.response) {
          errorData = error.response.data;
      }

      return Promise.reject(errorData);
    }
  }

   post<T = any>(url: string, config?: AxiosRequestConfig) {
    if (!this.m_Client) {
        throw new Error('An axios client is missing!');
    }

    const requestConfig: AxiosRequestConfig = {
        ...config
    };

    return this.m_Client.post<T>(url, requestConfig);
  }

  async put<T = any>(url: string, config?: AxiosRequestConfig) {
    if (!this.m_Client) {
        throw new Error('An axios client is missing!');
    }

    const requestConfig: AxiosRequestConfig = {
        ...config
    };

    return this.m_Client.put<T>(url, requestConfig);
  }

  async patch<T = any>(url: string, config?: AxiosRequestConfig) {
    if (!this.m_Client) {
        throw new Error('An axios client is missing!');
    }

    const requestConfig: AxiosRequestConfig = {
        ...config
    };

    return this.m_Client.patch<T>(url, requestConfig);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig) {
    if (!this.m_Client) {
        throw new Error('An axios client is missing!');
    }

    const requestConfig: AxiosRequestConfig = {
        ...config
    };

    return this.m_Client.delete<T>(url, requestConfig);
  }

  // Necessary to override
  /**
   * Check api connection using personal access token.
   * 
   * @param token represents a personal access token.
   */
  abstract check<T>(token: string) : Promise<T>;
};