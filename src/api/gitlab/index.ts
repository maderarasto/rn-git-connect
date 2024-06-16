import { AxiosRequestConfig } from "axios";
import ApiClient from "../ApiClient";
import { Repository, User } from "@src/types";
import { getActiveAccountToken } from "@src/utils";
import { QueryParams, Response } from "./types";

const GitLabClient = new ApiClient(
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
            const response = await GitLabClient.get<Response.User>('/user', config);

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

const projects = {
    getAll: async (
        query: QueryParams.Projects,
        signal?: AbortSignal
    ): Promise<Repository[]> => {
        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${await getActiveAccountToken()}`
            },
            params: query,
            signal,
        };

        const response = await GitLabClient.get<Response.Project[]>('/projects', config);

        return response.map((responseItem) => ({
            id: responseItem.id,
            name: responseItem.name,
            path: responseItem.path,
            fullpath: responseItem.path_with_namespace,
            avatarUrl: responseItem.avatar_url,
            owner: responseItem.owner,
            description: responseItem.description,
            createdAt: responseItem.created_at,
            gitUrl: responseItem.http_url_to_repo,
            sshUrl: responseItem.ssh_url_to_repo,
            cloneUrl: responseItem.http_url_to_repo,
            topics: responseItem.topics,
            visibility: responseItem.visibility,
            updatedAt: responseItem.updated_at
        }));
    }
}

const GitLabAPI = {
    auth,
    projects
};

export default GitLabAPI;