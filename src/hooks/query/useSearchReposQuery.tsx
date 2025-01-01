import {Repository, SearchReposParams} from "@src/api/types";
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {useApi} from "@src/providers/ApiProvider";
import {ErrorData} from "@src/api/ApiClient";

export type SearchReposQueryProps = {
  queryKey: string
  params?: SearchReposParams
  enabled?: boolean
}

const DEFAULT_LIST_PAGE = 1;
const DEFAULT_LIST_PAGE_SIZE = 10;

const useSearchReposQuery = ({
  queryKey,
  params = {
    perPage: 10,
  },
  enabled = true
}: SearchReposQueryProps) => {
  const queryClient = useQueryClient();
  const {api} = useApi();

  if (!api) {
    throw new Error('Missing required api resolver!');
  }

  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch
  } = useInfiniteQuery<Repository[], ErrorData>({
    queryKey: [queryKey],
    queryFn: ({pageParam}) => {
      return api.searchRepositories({
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
  }: SearchReposParams): SearchReposParams => {
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

  return { data, error, hasNextPage, isFetching, isFetchingNextPage, refetch, fetchNextPage, invalidateQuery, resetQuery};
}

export default useSearchReposQuery;