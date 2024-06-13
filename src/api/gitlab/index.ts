import { AxiosRequestConfig } from "axios";
import ApiClient from "../ApiClient";
import { User } from "@src/types";
import { getActiveAccountToken } from "@src/utils";
import { Response } from "./types";

const GitHubClient = new ApiClient(
    'https://gitlab.com/api/v4'
);

const auth = {
    user: async function (token: string = ''): Promise<User> {
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${!token ? await getActiveAccountToken() : token}`
            }
        };

        try {
            const response = await GitHubClient.get<Response.User>('/user', config);

            return {
                id: response.id,
                username: response.username,
                fullname: response.name,
                avatarUrl: response.avatar_url,
                webUrl: response.web_url,
                company: response.organization,
                location: response.location,
                email: response.email,
                bio: response.bio,
                followers: response.followers,
                following: response.following,
                createdAt: response.created_at,
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

const GitLabAPI = {
    auth,
};

export default GitLabAPI;