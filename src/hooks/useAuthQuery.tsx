import { ErrorData } from '@src/api/ApiClient';
import { User } from '@src/api/types';
import { useApi } from '@src/providers/ApiProvider';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const useAuthQuery = (token : string, enabled: boolean) => {
  const client = useQueryClient();
  const {api} = useApi();

  if (!api) {
    throw new Error();
  }

  const {
    data,
    error,
    status,
    isLoading,
    isFetched,
  } = useQuery<User, ErrorData>({
    queryKey: ['check'],
    queryFn: () => api.check(token),
    retry: 0,
    enabled,
  });

  return {
    data,
    error,
    status,
    isLoading,
    isFetched,
    invalidate: async () => {
      client.setQueryData(['check'], null);
      await client.invalidateQueries({
        queryKey: ['check']
      })
    }
  }
}

export default useAuthQuery;