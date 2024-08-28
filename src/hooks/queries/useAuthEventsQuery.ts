import { ErrorData } from "@src/api/ApiClient";
import GitHubAPI from "@src/api/github";
import { AuthUserContext } from "@src/context/AuthUserContext";
import {
  AbortControllerRef,
  AccountInfiniteQueryProps,
  AccountType,
  ActivityEvent,
	User,
} from "@src/types";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useRef } from "react";

export type AuthEventsQueryProps = {
  page: number
  perPage: number
  username?: string
};

const queriesProps: AccountInfiniteQueryProps = {
  GitHub: {
    queryKey: "getAuthEvents",
    callback: (props) => GitHubAPI.users.events(props["username"], {
			page: props['page'],
			per_page: props['perPage']
		}),
  },
  GitLab: {
    queryKey: "getAuthEvents",
    callback: (props) => Promise.resolve(),
  },
};

function buildInfiniteQuery(
  user: User,
  props: AuthEventsQueryProps,
  abortRef: AbortControllerRef,
  enabled: boolean = true
) {
  const infiniteQueryProps = queriesProps[user.accountType as AccountType];

  return useInfiniteQuery<ActivityEvent[], ErrorData>({
    queryKey: [infiniteQueryProps.queryKey],
    queryFn: ({ pageParam }) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      return infiniteQueryProps.callback({
        ...props,
				username: user.username as string,
        page: pageParam as number,
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
  });
}

export function useAuthEventsQuery(
  query: AuthEventsQueryProps = {
    page: 1,
    perPage: 10,
  },
  enabled: boolean = true
) {
	const authUserContext = useContext(AuthUserContext);
  const abortRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();
  
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
  } = buildInfiniteQuery(authUser, query, abortRef, enabled);

  const invalidateQuery = async () => {
    queryClient.setQueryData(['getAuthEvents'], null);
    await queryClient.invalidateQueries({
        queryKey: ['getAuthEvents']
    });
};

  return {
    data,
    isFetching,
    error,
    fetchNextPage,
    invalidateQuery,
  };
}
