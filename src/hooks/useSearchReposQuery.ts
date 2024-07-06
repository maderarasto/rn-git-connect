import { ErrorData } from "@src/api/ApiClient"
import GitHubAPI from "@src/api/github"
import { QueryParams as GitHubQueryParams } from "@src/api/github/types";
import { QueryParams as GitLabQueryParams } from "@src/api/gitlab/types";
import { AccountType, Repository } from "@src/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useRef } from "react"

export type SearchReposQueryProps = {
    searchText?: string
    page? : number
    perPage?: number
    sort?: 'best-match' | 'stars' | 'forks' | 'help-wanted-issues' | 'updated'
    order?: 'asc' | 'desc'
}

export function useSearchReposQuery(
    api: AccountType,
    username: string,
    query: SearchReposQueryProps = {},
    enabled: boolean = true
) {
    const abortRef = useRef<AbortController | null>(null);

    query.searchText = query.searchText ? query.searchText : '';
    query.perPage = query.perPage ? query.perPage : 10;
    query.sort = query.sort ? query.sort : 'best-match';
    query.order = query.order ? query.order : 'desc';
    
    const {
        data: githubData,
        isFetching: isGithubFetching,
        error: githubError,
        refetch: githubRefetch,
        fetchNextPage: fetchGithubNextPage,
    } = useInfiniteQuery<Repository[], ErrorData>({
        queryKey: ['githubSearchRepos'],
        queryFn: ({ pageParam }) => {
            abortRef.current?.abort();
            abortRef.current = new AbortController();
            query.page = pageParam as number;

            if (!enabled) {
                return [];
            }

            return GitHubAPI.search.repositories(
                username, 
                query.searchText as string,
                getGitHubQueryParams(),
                abortRef.current.signal
            );
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, _, lastPageParam) => {
            if (!enabled || !lastPage.length) {
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
        refetch: gitlabRefetch,
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
    const refetch = api === 'GitHub' ? githubRefetch : gitlabRefetch;
    const fetchNextPage = api === "GitHub" ? fetchGithubNextPage : fetchGitlabNextPage;

    function getGitHubQueryParams() : GitHubQueryParams.SearchRepositories {
        return {
            page: query.page,
            per_page: query.perPage,
            sort: query.sort,
            order: query.order
        };
    }
    
    function getGitLabQueryParams() : GitLabQueryParams.Projects {
        return {
            page: query.page,
            per_page: query.perPage,
        }
    }

    return {
        data,
        isFetching,
        error,
        refetch,
        fetchNextPage
      };
}