import { AxiosRequestConfig } from "axios";
import ApiClient from "./ApiClient";
import { AuthUser } from "./types";
import * as SecureStore from 'expo-secure-store';

const GitHubClient = new ApiClient(
    'https://gitlab.com/api/v4'
);

const auth = {
    user: async function () {
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${await SecureStore.getItemAsync('pat')}`
            }
        };

        return GitHubClient.get<AuthUser>('/user', config);
    }
}

const GitLabAPI = {
    auth,
};

export default GitLabAPI;