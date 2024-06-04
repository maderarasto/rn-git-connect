import axios, { Axios, AxiosRequestConfig } from "axios";
import * as SecureStore from 'expo-secure-store';

export default class ApiClient {
    private client: Axios;

    constructor(baseUrl: string) {
        this.client = axios.create({
            baseURL: baseUrl,
            timeout: 3000,
            headers: {
                Accept: 'application/json',
            }
        })
    }

    async get(url: string, config?: AxiosRequestConfig) {
        if (!this.client) {
            throw new Error('An axios client is missing!');
        }
        
        const requestConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `token ${await SecureStore.getItemAsync('pat')}`
            },
            ...config
        };

        return this.client.get(url, requestConfig);
    }

    async post(url: string, config?: AxiosRequestConfig) {
        if (!this.client) {
            throw new Error('An axios client is missing!');
        }

        const requestConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `token ${await SecureStore.getItemAsync('pat')}`
            },
            ...config
        };

        return this.client.post(url, requestConfig);
    }

    async put(url: string, config?: AxiosRequestConfig) {
        if (!this.client) {
            throw new Error('An axios client is missing!');
        }

        const requestConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `token ${await SecureStore.getItemAsync('pat')}`
            },
            ...config
        };

        return this.client.put(url, requestConfig);
    }

    async patch(url: string, config?: AxiosRequestConfig) {
        if (!this.client) {
            throw new Error('An axios client is missing!');
        }

        const requestConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `token ${await SecureStore.getItemAsync('pat')}`
            },
            ...config
        };

        return this.client.patch(url, requestConfig);
    }

    async delete(url: string, config?: AxiosRequestConfig) {
        if (!this.client) {
            throw new Error('An axios client is missing!');
        }

        const requestConfig: AxiosRequestConfig = {
            headers: {
                Authorization: `token ${await SecureStore.getItemAsync('pat')}`
            },
            ...config
        };

        return this.client.delete(url, requestConfig);
    }
}