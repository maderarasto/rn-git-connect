import { ErrorData } from "@src/api/ApiClient";
import { Event, ListQuery } from "@src/api/types";
import { useApi } from "@src/providers/ApiProvider";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";

export type EventQueryProps = {
  queryKey: string  
  params?: ListQuery
  enabled?: boolean
}

const DEFAULT_LIST_LIMIT = 20;

const useEventsQuery = (
  username: string, 
  { 
    queryKey,
    params = { perPage: 10 }, 
    enabled = false,
  }: EventQueryProps
) => {
  const {api} = useApi();
  const queryClient = useQueryClient();
  
  if (!api) {
    throw new Error();
  }

  const {
    data,
    error,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<Event[], ErrorData>({
    queryKey: [queryKey],
    queryFn: ({pageParam}) => {
      return api.getEvents(username, { 
        page: pageParam as number,
        ...params,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastParamPage) => {
      if (lastPage.length < (params.perPage ?? DEFAULT_LIST_LIMIT)) {
        return undefined;
      }
      
      return (lastParamPage as number) + 1;
    },
    retry: false,
    enabled
  });

  const invalidateQuery = async (key: string = queryKey) => {
    await queryClient.invalidateQueries({ queryKey: [key] });
    queryClient.setQueryData([key], null);
  }

  const resetQuery = async () => {
    queryClient.setQueryData([queryKey], null);
  }

  return { data, error, isLoading, isFetching, hasNextPage, fetchNextPage, invalidateQuery, resetQuery};
};

export default useEventsQuery;