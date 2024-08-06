import { ErrorData } from "@src/api/ApiClient";
import GitHubAPI from "@src/api/github";
import GitLabAPI from "@src/api/gitlab";
import { AccountType, AccountQueryProps, ApiType, User } from "@src/types";
import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";

const queriesProps: AccountQueryProps = {
    'GitHub': {
        queryKey: 'githubAuthUser',
        callback: GitHubAPI.auth.user
    },
    'GitLab': {
        queryKey: 'gitlabAuthUser',
        callback: GitLabAPI.auth.user
    },
};

async function resolveData(accountType: AccountType, accountToken: string, callback: (token?: string) => Promise<User>) {
    try {
        const userData = await callback(accountToken);

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

function buildQuery(accountType: AccountType, accountToken: string, enabled?: boolean) {
    const queryProps = queriesProps[accountType];

    return useQuery<User, ErrorData>({
        queryKey: [queryProps?.queryKey],
        queryFn: () => resolveData(accountType, accountToken, queryProps.callback),
        enabled
    })
}

export default function useAuthQuery(accountType: AccountType, token: string = '', enabled: boolean = false) {
    const [authToken, setAuthToken] = useState(token);
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        error,
        refetch,
    } = buildQuery(accountType, authToken, enabled);

    const invalidateQuery = (all: boolean = false) => {
        if (all) {
            return queryClient.invalidateQueries();
        }

        return queryClient.invalidateQueries({
            queryKey: [queriesProps[accountType].queryKey]
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