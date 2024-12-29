import {Repository, RepositoryListParams} from "@src/api/types";
import {useAuth} from "@src/providers/AuthProvider";
import {useApi} from "@src/providers/ApiProvider";
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {ErrorData} from "@src/api/ApiClient";

export type OwnerReposQueryProps = {
  queryKey: string
  params?: RepositoryListParams
  enabled?: boolean
};

const DEFAULT_LIST_PAGE = 1;
const DEFAULT_LIST_PAGE_SIZE = 10;

const useMemberReposQuery = ({
  queryKey,
  params = {
    perPage: 10,
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
        ...resolveParams(params),
        page: pageParam as number,
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

  const resolveParams = ({
    page,
    perPage,
    ...props
  }: RepositoryListParams): RepositoryListParams => {
    return {
      page: params.page ?? DEFAULT_LIST_PAGE,
      perPage: params.perPage ?? DEFAULT_LIST_PAGE_SIZE,
      ...props,
    };
  }

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

export default useMemberReposQuery;