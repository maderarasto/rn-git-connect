import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { Connection } from "@src/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ConnectionWithToken = {
    connection: Connection,
    accountToken?: string
}

export default function useConnection(accountId: string) {
    const [connectionWithToken, setConnectionWithToken] = useState<ConnectionWithToken|null>(null);

    useEffect(() => {
        loadConnection();
    }, []);

    async function loadConnection() {
        let connectionsItem : unknown = await AsyncStorage.getItem('connections');
        let connections: Record<string, Connection> = {};

        if (!connectionsItem) {
            return;
        }

        if (typeof connectionsItem === 'string') {
            connections = JSON.parse(connectionsItem);
        }

        if (!connections[accountId as string]) {
            return;
        }

        const connection = connections[accountId as string];
        const accountToken = await SecureStore.getItemAsync(accountId) ?? '';
        
        setConnectionWithToken({
            connection,
            accountToken,
        });
    }

    return {
        connection: connectionWithToken?.connection,
        accountToken: connectionWithToken?.accountToken,
    };
}