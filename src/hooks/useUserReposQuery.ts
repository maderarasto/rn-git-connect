import { ErrorData } from "@src/api/ApiClient";
import GitHubAPI from "@src/api/github";
import { QueryParams } from "@src/api/github/types";
import { AccountType, Repository, } from "@src/types";
import { useInfiniteQuery,  } from "@tanstack/react-query";
import {  useRef,  } from "react";

export function useUserReposQuery(
  api: AccountType,
  username: string,
  query: QueryParams.UserRepositories = {},
  enabled: boolean = true
) {
  const abortRef = useRef<AbortController | null>(null);

  const {
		data: githubData,
		isFetching: isGithubFetching,
		error: githubError,
		fetchNextPage: fetchGithubNextPage,
	} = useInfiniteQuery<Repository[], ErrorData>({
		queryKey: ['githubUserRepos'],
		queryFn: ({pageParam}) => {
			abortRef.current?.abort();
			abortRef.current = new AbortController();

			return GitHubAPI.users.repos(username, {
				...query,
				per_page: 10,
				page: pageParam as number
			});
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, _, lastPageParam) => {
			if (!lastPage.length) {
				return undefined;
			}

			return (lastPageParam as number) + 1;
		},
		enabled
	})

  const data = api === "GitHub" ? githubData : undefined;
  const isFetching = api === "GitHub" ? isGithubFetching : undefined;
  const error = api === "GitHub" ? githubError : undefined;
  const fetchNextPage = api === "GitHub" ? fetchGithubNextPage : undefined;

  return {
    data,
    isFetching,
    error,
    fetchNextPage
  };
}
