import axios, {Axios, AxiosRequestConfig} from 'axios';
import {EditableUser, Event, Repository, User} from './types';

export type ApiClientOptions = {
  baseUrl: string
  token?: string
  tokenPrefix?: string
  timeout?: number
};

export type ErrorData = {
  message: string
  error?: string
};

const DEFAULT_OPTIONS_TIMEOUT = 1000;
const DEFAULT_OPTIONS_TOKEN = '';
const DEFAULT_OPTIONS_TOKEN_PREFIX = 'Bearer';
const DEFAULT_OPTIONS_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export default abstract class ApiClient {
  private m_Client: Axios;

  // Public properties
  public token: string;
  public tokenPrefix: string;

  constructor(options: ApiClientOptions) {
    this.token = options.token ?? DEFAULT_OPTIONS_TOKEN;
    this.tokenPrefix = options.tokenPrefix ?? DEFAULT_OPTIONS_TOKEN_PREFIX;
    this.m_Client = axios.create({
      baseURL: options.baseUrl,
      timeout: options.timeout ?? DEFAULT_OPTIONS_TIMEOUT,
      headers: DEFAULT_OPTIONS_HEADERS
    });
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig) {
    if (!this.m_Client) {
        throw new Error('An axios client is missing!');
    }
    
    const requestConfig: AxiosRequestConfig = {
        ...config,
    };

    if (this.token) {
      requestConfig.headers = {
        'Authorization': `${this.tokenPrefix} ${this.token}`,
        ...requestConfig.headers,
      }
    }

    try {
        const response = await this.m_Client.get<T>(url, requestConfig);
        return response.data;
    } catch (error) {
      let errorData: ErrorData = {
          message: (error as Error).message,
      };

      if (axios.isAxiosError(error) && error.response) {
          errorData = error.response.data;

          if (errorData.error === 'invalid_token') {
            errorData.message = 'Token is no longer valid!';
          }
      }

      return Promise.reject(errorData);
    }
  }

  protected async post<T = any>(url: string, data: Record<string, any>, config?: AxiosRequestConfig) {
    if (!this.m_Client) {
        throw new Error('An axios client is missing!');
    }

    const requestConfig: AxiosRequestConfig = {
        ...config
    };

    if (this.token) {
      requestConfig.headers = {
        'Authorization': `${this.tokenPrefix} ${this.token}`,
        ...requestConfig.headers,
      }
    }

    return this.m_Client.post<T>(url, data, requestConfig);
  }

  protected async put<T = any>(url: string, data: Record<string, any>, config?: AxiosRequestConfig) {
    if (!this.m_Client) {
        throw new Error('An axios client is missing!');
    }

    const requestConfig: AxiosRequestConfig = {
        ...config
    };

    if (this.token) {
      requestConfig.headers = {
        'Authorization': `${this.tokenPrefix} ${this.token}`,
        ...requestConfig.headers,
      }
    }

    return this.m_Client.put<T>(url, data, requestConfig);
  }

  protected async patch<T = any>(url: string, data: Record<string, any>, config?: AxiosRequestConfig) {
    if (!this.m_Client) {
        throw new Error('An axios client is missing!');
    }

    const requestConfig: AxiosRequestConfig = {
        ...config
    };

    if (this.token) {
      requestConfig.headers = {
        'Authorization': `${this.tokenPrefix} ${this.token}`,
        ...requestConfig.headers,
      }
    }

    return this.m_Client.patch<T>(url, data, requestConfig);
  }

  protected async delete<T = any>(url: string, config?: AxiosRequestConfig) {
    if (!this.m_Client) {
        throw new Error('An axios client is missing!');
    }

    const requestConfig: AxiosRequestConfig = {
        ...config
    };

    if (this.token) {
      requestConfig.headers = {
        'Authorization': `${this.tokenPrefix} ${this.token}`,
        ...requestConfig.headers,
      }
    }

    return this.m_Client.delete<T>(url, requestConfig);
  }

  /**
   * Check api connection using personal access token.
   * 
   * @param token represents a personal access token.
   */
  abstract check(token: string) : Promise<User>;

  /**
   * Gets all contribution events of specific user.
   *
   * @param username unique username of user
   * @param query
   * @query query parameters
   */
  abstract getEvents(username: string, query: Record<string, any>) : Promise<Event[]>;

  /**
   * Gets a repository with specific id.
   * 
   * @param id unique identifier
   */
  abstract getRepository(id: number) : Promise<Repository>;

  /**
   * Updates an authenticated user.
   *
   * @param updateData user to be updated.
   */
  abstract updateAuthUser(updateData: EditableUser): Promise<User>;
};