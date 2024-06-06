import { AxiosRequestConfig } from "axios";
import ApiClient from "./ApiClient";
import { AuthUser } from "./types";
import { getActiveAccountToken } from "@src/utils";

const GitHubClient = new ApiClient(
    'https://gitlab.com/api/v4'
);

const auth = {
    user: async function (token: string = '') {
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${!token ? await getActiveAccountToken() : token}`
            }
        };

        return GitHubClient.get<AuthUser>('/user', config);
    }
}

const GitLabAPI = {
    auth,
};

export default GitLabAPI;