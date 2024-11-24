import { ErrorData } from "@src/api/ApiClient";
import { Event, ListQuery } from "@src/api/types";
import { useApi } from "@src/providers/ApiProvider";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";

export type EventQueryProps = {
  params?: ListQuery
  enabled: boolean
}

const useEventsQuery = (
  username: string, 
  { 
    params = {}, 
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
    isFetching
  } = useInfiniteQuery<Event[], ErrorData>({
    queryKey: ['getEvents'],
    queryFn: ({pageParam}) => {
      return api.getEvents(username, { 
        page: pageParam as number,
        ...params,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastParamPage) => {
      if (!lastPage) {
        return;
      }

      return (lastParamPage as number) + 1;
    },
    retry: 2,
    enabled
  });

  const invalidateQuery = async () => {
    await queryClient.invalidateQueries({ queryKey: ['getEvents'] });
    queryClient.setQueryData(['getEvents'], null);
  }

  return { data, error, isLoading, isFetching, invalidateQuery};
};

export default useEventsQuery;