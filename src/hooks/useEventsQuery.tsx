import { ErrorData } from "@src/api/ApiClient";
import { Event } from "@src/api/types";
import { useApi } from "@src/providers/ApiProvider";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";

const useEventsQuery = (username: string, enabled: boolean = false) => {
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
    queryFn: () => api.getEvents(username),
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