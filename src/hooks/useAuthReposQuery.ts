import { ErrorData } from "@src/api/ApiClient";
import GitHubAPI from "@src/api/github";
import { QueryParams as GitHubQueryParams } from "@src/api/github/types";
import GitLabAPI from "@src/api/gitlab";
import { QueryParams as GitLabQueryParams } from "@src/api/gitlab/types";
import { AuthUserContext } from "@src/context/AuthUserContext";
import { AccountType, Repository } from "@src/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useRef } from "react";

export type AuthRepoQueryProps = {
  page: number
  perPage: number
}

export function useAuthReposQuery(
  query: AuthRepoQueryProps = {
    page: 1,
    perPage: 10
  },
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

  function getGitHubQueryParams() : GitHubQueryParams.UserRepositories {
    return {
      page: query.page,
      per_page: query.perPage,
      type: 'owner'
    };
  }

  function getGitLabQueryParams() : GitLabQueryParams.Projects {
    return {
      page: query.page,
      per_page: query.perPage,
      owned: true,
    }
  }

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
        ...getGitHubQueryParams(),
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
    enabled: authUser.accountType === 'GitHub' && enabled
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
				...getGitLabQueryParams(),
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
    enabled: authUser.accountType === 'GitLab' && enabled
  });

  const data = authUser.accountType === "GitHub" ? githubData : gitlabData;
  const isFetching = authUser.accountType === "GitHub" ? isGithubFetching : isGitlabFetching;
  const error = authUser.accountType === "GitHub" ? githubError : gitlabError;
  const fetchNextPage = authUser.accountType === "GitHub" ? fetchGithubNextPage : fetchGitlabNextPage;

  return {
    data,
    isFetching,
    error,
    fetchNextPage
  };
}
