import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { convertFromSlug } from "@src/utils";
import { AccountType } from "@src/types";


export default function useActiveAccount() {
    const [accountId, setAccountId] = useState<string|null>(null);
    const [accountToken, setAccountToken] = useState<string|null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async function () {
            const found = await AsyncStorage.getItem('active_account_id')

            if (!found) {
                setAccountId(null);
                setAccountToken(null);
                setIsLoading(false);
                return;
            }

            setAccountId(found);
            setAccountToken(await SecureStore.getItemAsync(found));
            setIsLoading(false);
        })();
    }, [])

    function resolveAccountType() {
        if (!accountId) {
            return '' as AccountType;
        }

        return convertFromSlug(accountId.split('.').at(0)?.replace('-token', '') ?? '') as AccountType;
    }

    return {
        accountType: resolveAccountType(),
        accountId,
        accountToken,
        isLoading
    };
}