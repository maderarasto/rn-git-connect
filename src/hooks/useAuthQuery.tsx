import { ErrorData } from '@src/api/ApiClient';
import { User } from '@src/api/types';
import { useApi } from '@src/providers/ApiProvider';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const useAuthQuery = (token : string, enabled: boolean) => {
  const {api} = useApi();
  const queryClient = useQueryClient();

  if (!api) {
    throw new Error();
  }

  const {
    data,
    error,
    status,
    isLoading,
    isFetching,
    isFetched,
  } = useQuery<User, ErrorData>({
    queryKey: ['check'],
    queryFn: () => api.check(token),
    retry: 0,
    enabled,
  });

  const invalidateQuery = async () => {
    await queryClient.invalidateQueries({ queryKey: ['check'] });
    queryClient.setQueryData(['check'], null);
  }

  const removeQuery = () => {
    queryClient.removeQueries({ queryKey: ['check'] });
  }

  return {
    data,
    error,
    status,
    isLoading,
    isFetching,
    isFetched,
    invalidateQuery,
    removeQuery,
  }
}

export default useAuthQuery;