import { ErrorData } from "@src/api/ApiClient";
import GitHubAPI from "@src/api/github";
import GitLabAPI from "@src/api/gitlab";
import { ApiType, AuthUser } from "@src/api/types";
import { useQuery } from "@tanstack/react-query";

export default function useAuthQuery(api: ApiType, enabled = false) {
    const {
        data: githubData, 
        isLoading: githubIsLoading, 
        error: githubError,
        refetch: githubRefetch
    } = useQuery<AuthUser, ErrorData>({
        queryKey: ['githubAuthUser'],
        queryFn: () => GitHubAPI.auth.user(),
        enabled: false
    });

    const {
        data: gitlabData, 
        isLoading: gitlabIsLoading, 
        error: gitlabError,
        refetch: gitlabRefetch
    } = useQuery<AuthUser, ErrorData>({
        queryKey: ['gitlabAuthUser'],
        queryFn: () => GitLabAPI.auth.user(),
        enabled: false
    });

    const data = api === 'GitHub' ? githubData : gitlabData;
    const isLoading = api === 'GitHub' ? githubIsLoading : gitlabIsLoading;
    const error = api === 'GitHub' ? githubError : gitlabError;
    const refetch = api === 'GitHub' ? githubRefetch : gitlabRefetch;

    if (enabled) {
        refetch();
    }

    return {
        data,
        isLoading,
        error,
        refetch
    };
}