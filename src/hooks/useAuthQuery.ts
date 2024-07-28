import { ErrorData } from "@src/api/ApiClient";
import GitHubAPI from "@src/api/github";
import GitLabAPI from "@src/api/gitlab";
import { AccountType, ApiType, User } from "@src/types";
// import GitLabAPI from "@src/api/gitlab";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function useAuthQuery(api: ApiType, token = '', enabled = false) {
    const [authToken, setAuthToken] = useState(token);

    const {
        data: githubData, 
        isLoading: githubIsLoading, 
        error: githubError,
        refetch: githubRefetch
    } = useQuery<User, ErrorData>({
        queryKey: ['githubAuthUser'],
        queryFn: () => resolveData(GitHubAPI.auth.user, 'GitHub'),
        enabled: false,
    });

    const {
        data: gitlabData, 
        isLoading: gitlabIsLoading, 
        error: gitlabError,
        refetch: gitlabRefetch
    } = useQuery<User, ErrorData>({
        queryKey: ['gitlabAuthUser'],
        queryFn: () => resolveData(GitLabAPI.auth.user, 'GitLab'),
        enabled: false,
    });

    const data = api === 'GitHub' ? githubData : gitlabData;
    const isLoading = api === 'GitHub' ? githubIsLoading : gitlabIsLoading;
    const error = api === 'GitHub' ? githubError : gitlabError;
    const refetch = api === 'GitHub' ? githubRefetch : gitlabRefetch;

    async function resolveData(callback: (token?: string) => Promise<User>, accountType: AccountType) {
        try {
            const userData = await callback(authToken);

            if (!userData) {
                return userData;
            }

            return {
                ...userData,
                accountType,
            };
        } catch (err) {
            return Promise.reject(err);
        }
    }

    if (enabled) {
        refetch();
    }

    return {
        data,
        isLoading,
        error,
        authToken,
        setAuthToken,
        refetch,
    };
}