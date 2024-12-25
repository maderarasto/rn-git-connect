import {ListQuery, Repository} from "@src/api/types";
import {useAuth} from "@src/providers/AuthProvider";
import {useApi} from "@src/providers/ApiProvider";
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {ErrorData} from "@src/api/ApiClient";

export type OwnerReposQueryProps = {
  queryKey: string
  params?: ListQuery
  enabled?: boolean
};

const useOwnerReposQuery = ({
  queryKey,
  params = {
    perPage: 10
  },
  enabled = true
}: OwnerReposQueryProps) => {
  const authContext = useAuth();
  const queryClient = useQueryClient();
  const {api} = useApi();

  if (!authContext?.user || !api) {
    throw new Error('Missing required api resolver or auth user!');
  }

  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery<Repository[], ErrorData>({
    queryKey: [queryKey],
    queryFn: ({pageParam}) => {
      return api.getOwnerRepositories({
        page: pageParam as number,
        ...params,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastParamPage) => {
      if (lastPage.length < (params.perPage ?? 10)) {
        return undefined;
      }

      return (lastParamPage as number) + 1;
    },
    retry: 2,
    enabled
  });

  const invalidateQuery = async (key: string = queryKey) => {
    await queryClient.invalidateQueries({ queryKey: [key] });
    queryClient.setQueryData([key], null);
  }

  const resetQuery = async (key: string = queryKey) => {
    await queryClient.resetQueries({ queryKey: [key]});
    // queryClient.setQueryData([key], null);
  }

  return { data, error, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage, invalidateQuery, resetQuery};
}

export default useOwnerReposQuery;