import { ErrorData } from "@src/api/ApiClient";
import GitHubAPI from "@src/api/github";
import GitLabAPI from "@src/api/gitlab";
import { ApiType, User } from "@src/types";
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
        queryFn: () => GitHubAPI.auth.user(authToken),
        enabled: false,
    });

    const {
        data: gitlabData, 
        isLoading: gitlabIsLoading, 
        error: gitlabError,
        refetch: gitlabRefetch
    } = useQuery<User, ErrorData>({
        queryKey: ['gitlabAuthUser'],
        queryFn: () => GitLabAPI.auth.user(authToken),
        enabled: false,
    });

    const data = api === 'GitHub' ? githubData : gitlabData;
    const isLoading = api === 'GitHub' ? githubIsLoading : gitlabIsLoading;
    const error = api === 'GitHub' ? githubError : gitlabError;
    const refetch = api === 'GitHub' ? githubRefetch : gitlabRefetch;

    function resolveData() {
        if (!data) {
            return data;
        }

        return {
            accountType: api,
            ...data
        };
    }

    if (enabled) {
        refetch();
    }

    return {
        data: resolveData(),
        isLoading,
        error,
        authToken,
        setAuthToken,
        refetch,
    };
}