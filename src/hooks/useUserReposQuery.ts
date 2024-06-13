import { ErrorData } from "@src/api/ApiClient";
import GitHubAPI from "@src/api/github";
import { QueryParams } from "@src/api/github/types";
import { AccountType, ApiType, Repository } from "@src/types";
import { useQuery } from "@tanstack/react-query";

export function useUserReposQuery(
    api: AccountType, 
    username: string, 
    query: QueryParams.UserRepositories,
    enabled: boolean = true
) {
    const {
        data: githubData,
        isLoading: githubIsLoading,
        error: githubError,
        refetch: githubRefetch
    } = useQuery<Repository[], ErrorData>({
        queryKey: ['githubUserRepos'],
        queryFn: () => GitHubAPI.users.repos(username, query),
        enabled,
    });

    const data = api === 'GitHub' ? githubData : undefined;
    const isLoading = api === 'GitHub' ? githubIsLoading : undefined;
    const error = api === 'GitHub' ? githubError : undefined;
    const refetch = api === 'GitHub' ? githubRefetch : undefined;

    return {
        data,
        isLoading,
        error,
        refetch,
    };
}