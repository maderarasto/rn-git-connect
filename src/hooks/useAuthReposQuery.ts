import { ErrorData } from "@src/api/ApiClient";
import GitHubAPI from "@src/api/github";
import GitLabAPI from "@src/api/gitlab";
import { AuthUserContext } from "@src/context/AuthUserContext";
import { AbortControllerRef, AccountInfiniteQueryProps, AccountType, Repository } from "@src/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useRef } from "react";

export type AuthRepoQueryProps = {
  page: number
  perPage: number
}

const queriesProps: AccountInfiniteQueryProps = {
  'GitHub': {
    queryKey: 'githubUserRepos',
    callback: (props) => GitHubAPI.auth.repos({
      ...{
        page: props['page'],
        per_page: props['perPage'],
        type: 'owner'
      },
    })
  },
  'GitLab': {
    queryKey: 'gitlabUserRepos',
    callback: (props) => GitLabAPI.projects.getAll({
      ...{
        page: props['page'],
        per_page: props['perPage'],
        owned: true
      }
    })
  }
};

function buildInfiniteQuery(accountType: AccountType, props: AuthRepoQueryProps, abortRef: AbortControllerRef, enabled: boolean = true) {
  const infiniteQueryProps = queriesProps[accountType];

  return useInfiniteQuery<Repository[], ErrorData>({
    queryKey: [infiniteQueryProps.queryKey],
    queryFn: ({ pageParam }) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      return infiniteQueryProps.callback({
        ...props,
        page: pageParam as number
      });
    },
    initialPageParam: 1,
    retry: false,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (!lastPage.length) {
        return undefined;
      }

      return (lastPageParam as number) + 1;
    },
    enabled,
  })
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

  if (!authUser.accountType) {
    throw new Error('Account type of user not found!');
  }

  const {
    data,
    isFetching,
    error,
    fetchNextPage,
  } = buildInfiniteQuery(authUser.accountType, query, abortRef, enabled);

  return {
    data,
    isFetching,
    error,
    fetchNextPage
  };
}
