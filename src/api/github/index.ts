import { AxiosRequestConfig } from "axios";
import ApiClient from "../ApiClient";
import { getActiveAccountToken } from "@src/utils";
import { QueryParams, Response } from "./types";
import { Repository, User } from "@src/types";

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
                bio: response.bio,
                followers: response.followers,
                following: response.following,
                createdAt: response.created_at,
            }
        } catch (error) {
            return Promise.reject(error)
        }
    },

    repos: async function (username: string, query: QueryParams.UserRepositories): Promise<Repository> {
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `token ${await getActiveAccountToken()}`
            },
            params: query
        };

        try {
            const response = await GitHubClient.get<Response.Repository>(`users/${username}/repos`, config);

            return {
                id: response.id,
                name: response.name,
                path: response.name,
                fullpath: response.full_name,
                owner: response.owner,
                description: response.description,
                createdAt: response.created_at,
                gitUrl: response.git_url,
                sshUrl: response.ssh_url,
                cloneUrl: response.clone_url,
                hasIssues: response.has_issues,
                hasWiki: response.has_wiki,
                hasPages: response.has_pages,
                hasDiscussions: response.has_discussions,
                topics: response.topics,
                visibility: response.visibility,
            }
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

const GitHubAPI = {
    auth,
};

export default GitHubAPI;