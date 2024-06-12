import { AxiosRequestConfig } from "axios";
import ApiClient from "../ApiClient";
import { getActiveAccountToken } from "@src/utils";
import { Response } from "./types";
import { User } from "@src/types";

const GitHubClient = new ApiClient(
    'https://api.github.com'
);

const auth = {
    user: async function (token: string = '') : Promise<User> {
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `token ${!token ? await getActiveAccountToken() : token}`
            }
        };

        try {
            const response = await GitHubClient.get<Response.User>('/user', config);

            return {
                id: response.id,
                username: response.login,
                fullname: response.name,
                avatarUrl: response.avatar_url,
                webUrl: response.html_url,
                company: response.company,
                location: response.location,
                email: response.email,
                bio: response.bio ?? '',
                followers: response.followers,
                following: response.following,
                createdAt: response.created_at,
            }
        } catch (error) {
            return Promise.reject(error)
        }
    },

    // repos: async function () {
    //     const config: AxiosRequestConfig = {
    //         headers: {
    //             Authorization: `token ${await getActiveAccountToken()}`
    //         }
    //     };


    // }
}

const GitHubAPI = {
    auth,
};

export default GitHubAPI;