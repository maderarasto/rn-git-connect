import { ErrorData } from "@src/api/ApiClient"
import GitHubAPI from "@src/api/github"
import { QueryParams as GitHubQueryParams } from "@src/api/github/types";
import GitLabAPI from "@src/api/gitlab";
import { QueryParams as GitLabQueryParams } from "@src/api/gitlab/types";
import { AuthUserContext } from "@src/context/AuthUserContext";
import { AccountType, Repository } from "@src/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useContext, useRef } from "react"

export type SearchReposQueryProps = {
    searchText?: string
    language?: string
    page? : number
    perPage?: number
    sort?: 'best-match' | 'stars' | 'forks' | 'help-wanted-issues' | 'updated'
    order?: 'asc' | 'desc'
}

export function useSearchReposQuery(
    { 
        searchText = '', 
        language, 
        ...query
    }: SearchReposQueryProps = {},
    enabled: boolean = true
) {
    const authUserContext = useContext(AuthUserContext);
    const abortRef = useRef<AbortController | null>(null);

    if (!authUserContext) {
        throw new Error('AuthUserContext must be used withing AuthUserProvider!');
    }

    if(!authUserContext.user) {
        throw new Error('User not found in AuthUserContext!');
    }

    const authUser = authUserContext.user;

    searchText = searchText ? searchText : '';
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
        queryFn: async({ pageParam }) => {
            abortRef.current?.abort();
            abortRef.current = new AbortController();
            query.page = pageParam as number;

            if (!enabled) {
                return [];
            }

            return GitHubAPI.search.repositories(
                getGitHubQueryParams(),
                abortRef.current.signal
            );
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, _, lastPageParam) => {
            if (!lastPage.length || lastPage.length < (query.perPage as number)) {
                return undefined;
            }
        
            return (lastPageParam as number) + 1;
        },
        enabled: authUser.accountType === 'GitHub' && enabled
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
            query.page = pageParam as number;

            if (!enabled) {
                return [];
            }

            return GitLabAPI.projects.getAll(getGitLabQueryParams(), abortRef.current.signal);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, _, lastPageParam) => {
            if (!lastPage.length) {
                return undefined;
            }
        
            return (lastPageParam as number) + 1;
        },
        enabled: authUser.accountType === 'GitLab' && enabled
    });

    const data = authUser.accountType === "GitHub" ? githubData : gitlabData;
    const isFetching = authUser.accountType === "GitHub" ? isGithubFetching : isGitlabFetching;
    const error = authUser.accountType === "GitHub" ? githubError : gitlabError;
    const refetch = authUser.accountType === 'GitHub' ? githubRefetch : gitlabRefetch;
    const fetchNextPage = authUser.accountType === "GitHub" ? fetchGithubNextPage : fetchGitlabNextPage;

    function getGitHubQueryParams() : GitHubQueryParams.SearchRepositories {
        let searchQuery = `user:${authUser.username}`;

        if (language) {
            searchQuery += ' language:' + language;
        }

        if (searchText) {
            searchQuery += ' ' + searchText;
        }

        return {
            q: searchQuery,
            page: query.page,
            per_page: query.perPage,
            sort: query.sort,
            order: query.order
        };
    }
    
    function getGitLabQueryParams() : GitLabQueryParams.Projects {
        let queryParams: GitLabQueryParams.Projects = {
            owned: true,
            page: query.page,
            per_page: query.perPage,
        };

        if (searchText) {
            queryParams.search = searchText;
        }

        if (language) {
            queryParams.with_programming_language = language;
        }

        return queryParams;
    }

    return {
        data,
        isFetching,
        error,
        refetch,
        fetchNextPage
      };
}