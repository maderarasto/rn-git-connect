import axios, { Axios, AxiosRequestConfig } from "axios";

export type ErrorData = {
    message: string
}

export default class ApiClient {
    private client: Axios;

    constructor(baseUrl: string) {
        this.client = axios.create({
            baseURL: baseUrl,
            timeout: 1000,
            headers: {
                Accept: 'application/json',
            }
        })
    }

    async get<T>(url: string, config?: AxiosRequestConfig) {
        if (!this.client) {
            throw new Error('An axios client is missing!');
        }
        
        const requestConfig: AxiosRequestConfig = {
            ...config
        };

        try {
            const response = await this.client.get<T>(url, requestConfig);
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

    async post<T = any>(url: string, config?: AxiosRequestConfig) {
        if (!this.client) {
            throw new Error('An axios client is missing!');
        }

        const requestConfig: AxiosRequestConfig = {
            ...config
        };

        return this.client.post<T>(url, requestConfig);
    }

    async put<T = any>(url: string, config?: AxiosRequestConfig) {
        if (!this.client) {
            throw new Error('An axios client is missing!');
        }

        const requestConfig: AxiosRequestConfig = {
            ...config
        };

        return this.client.put<T>(url, requestConfig);
    }

    async patch<T = any>(url: string, config?: AxiosRequestConfig) {
        if (!this.client) {
            throw new Error('An axios client is missing!');
        }

        const requestConfig: AxiosRequestConfig = {
            ...config
        };

        return this.client.patch<T>(url, requestConfig);
    }

    async delete<T = any>(url: string, config?: AxiosRequestConfig) {
        if (!this.client) {
            throw new Error('An axios client is missing!');
        }

        const requestConfig: AxiosRequestConfig = {
            ...config
        };

        return this.client.delete<T>(url, requestConfig);
    }
}