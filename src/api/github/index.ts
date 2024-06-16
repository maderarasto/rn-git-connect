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
}

const users = {
    repos: async function (
        username: string, 
        query: QueryParams.UserRepositories,
        signal: AbortSignal|undefined = undefined
    ): Promise<Repository[]> {
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `token ${await getActiveAccountToken()}`
            },
            params: query,
            signal,
        };

        try {
            const response = await GitHubClient.get<Response.Repository[]>(`users/${username}/repos`, config);
            
            return response.map((responseItem) => ({
                id: responseItem.id,
                name: responseItem.name,
                path: responseItem.name,
                fullpath: responseItem.full_name,
                owner: responseItem.owner,
                description: responseItem.description,
                language: responseItem.language,
                createdAt: responseItem.created_at,
                gitUrl: responseItem.git_url,
                sshUrl: responseItem.ssh_url,
                cloneUrl: responseItem.clone_url,
                hasIssues: responseItem.has_issues,
                hasWiki: responseItem.has_wiki,
                hasPages: responseItem.has_pages,
                hasDiscussions: responseItem.has_discussions,
                topics: responseItem.topics,
                visibility: responseItem.visibility,
                updatedAt: responseItem.updated_at
            }));
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

const GitHubAPI = {
    auth,
    users,
};

export default GitHubAPI;