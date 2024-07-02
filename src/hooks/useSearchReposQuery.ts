import { ErrorData } from "@src/api/ApiClient"
import GitHubAPI from "@src/api/github"
import { AccountType, Repository } from "@src/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useRef } from "react"

export type SearchReposQueryProps = {
    page: number
    perPage: number
}

export function useSearchReposQuery(
    api: AccountType,
    username: string,
    query: SearchReposQueryProps,
    enabled: boolean = true
) {
    const abortRef = useRef<AbortController | null>(null);

    const {
        data: githubData,
        isFetching: isGithubFetching,
        error: githubError,
        fetchNextPage: fetchGithubNextPage,
    } = useInfiniteQuery<Repository[], ErrorData>({
        queryKey: ['githubSearchRepos'],
        queryFn: ({ pageParam }) => {
            abortRef.current?.abort();
            abortRef.current = new AbortController();

            return GitHubAPI.search.repositories(username);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, _, lastPageParam) => {
            if (!lastPage.length) {
                return undefined;
            }
        
            return (lastPageParam as number) + 1;
        },
        enabled: api === 'GitHub' && enabled
    });

    const {
        data: gitlabData,
        isFetching: isGitlabFetching,
        error: gitlabError,
        fetchNextPage: fetchGitlabNextPage,
    } = useInfiniteQuery<Repository[], ErrorData>({
        queryKey: ['gitlabSearchRepos'],
        queryFn: ({ pageParam }) => {
            abortRef.current?.abort();
            abortRef.current = new AbortController();

            return new Promise((resolve) => resolve([]));
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, _, lastPageParam) => {
            if (!lastPage.length) {
                return undefined;
            }
        
            return (lastPageParam as number) + 1;
        },
        enabled: api === 'GitLab' && enabled
    });

    const data = api === "GitHub" ? githubData : gitlabData;
    const isFetching = api === "GitHub" ? isGithubFetching : isGitlabFetching;
    const error = api === "GitHub" ? githubError : gitlabError;
    const fetchNextPage = api === "GitHub" ? fetchGithubNextPage : fetchGitlabNextPage;

    return {
        data,
        isFetching,
        error,
        fetchNextPage
      };
}