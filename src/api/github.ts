import { AxiosRequestConfig } from "axios";
import * as SecureStore from 'expo-secure-store';
import ApiClient from "./ApiClient";
import { AuthUser } from "./types";

const GitHubClient = new ApiClient(
    'https://api.github.com'
);

const auth = {
    user: async function () {
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `token ${await SecureStore.getItemAsync('pat')}`
            }
        };

        return GitHubClient.get<AuthUser>('/user', config);
    }
}

const GitHubAPI = {
    auth,
};

export default GitHubAPI;