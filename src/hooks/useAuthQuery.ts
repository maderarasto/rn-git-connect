import { ErrorData } from "@src/api/ApiClient";
import GitHubAPI from "@src/api/github";
import GitLabAPI from "@src/api/gitlab";
import { AccountType, AccountQueryProps, ApiType, User, QueryProps } from "@src/types";
import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";

const queriesProps: () => AccountQueryProps = () => ({
    'GitHub': {
        queryKey: 'githubAuthUser',
        callback: GitHubAPI.auth.user
    },
    'GitLab': {
        queryKey: 'gitlabAuthUser',
        callback: GitLabAPI.auth.user
    },
});

async function resolveData(accountType: AccountType, accountToken: string, callback: (token?: string) => Promise<User>) {
    try {
        const userData = await callback(accountToken);
        console.log(userData);
        if (!userData) {
            return userData;
        }

        return {
            ...userData,
            accountType,
        };
    } catch (err) {
        return Promise.reject(err);
    }
}

export default function useAuthQuery(accountType: AccountType, token: string = '', enabled: boolean = false) {
    const [authToken, setAuthToken] = useState(token);
    const queryClient = useQueryClient();
    
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<User, ErrorData>({
        queryKey: ['authUser'],
        queryFn: () => resolveData(accountType, authToken, queriesProps()[accountType].callback),
        retry: 3,
        enabled
    })

    const invalidateQuery = async () => {
        queryClient.setQueryData(['authUser'], null);
        await queryClient.invalidateQueries({
            queryKey: ['authUser']
        });
    };

    return {
        data,
        isLoading,
        error,
        authToken,
        setAuthToken,
        refetch,
        invalidateQuery,
    };
}