import { ErrorData } from "@src/api/ApiClient";
import GitHubAPI from "@src/api/github";
import { QueryParams } from "@src/api/github/types";
import GitLabAPI from "@src/api/gitlab";
import { AccountType, Repository } from "@src/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";

export function useAuthReposQuery(
  api: AccountType,
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
    queryKey: ["githubUserRepos"],
    queryFn: ({ pageParam }) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      return GitHubAPI.auth.repos({
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
    enabled: api === 'GitHub' && enabled
  });

	const {
    data: gitlabData,
    isFetching: isGitlabFetching,
    error: gitlabError,
    fetchNextPage: fetchGitlabNextPage
  } = useInfiniteQuery<Repository[], ErrorData>({
    queryKey: ["gitlabUserRepos"],
    queryFn: ({ pageParam }) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      return GitLabAPI.projects.getAll({
				membership: true,
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
