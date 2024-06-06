import { AxiosRequestConfig } from "axios";
import * as SecureStore from 'expo-secure-store';
import ApiClient from "./ApiClient";
import { AuthUser } from "./types";
import { getActiveAccountToken } from "@src/utils";

const GitHubClient = new ApiClient(
    'https://api.github.com'
);

const auth = {
    user: async function (token: string = '') {
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `token ${!token ? await getActiveAccountToken() : token}`
            }
        };

        return GitHubClient.get<AuthUser>('/user', config);
    }
}

const GitHubAPI = {
    auth,
};

export default GitHubAPI;