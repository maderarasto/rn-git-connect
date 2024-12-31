import { View, Text, Image, StyleSheet, Platform, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react';
import useConnections, { Connection } from '@src/hooks/useConnections';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import ConnectionItem from '@src/components/ConnectionItem';
import { useApi } from '@src/providers/ApiProvider';
import useAuthQuery from '@src/hooks/query/useAuthQuery';
import { AccountType, User } from '@src/api/types';
import { useAuth } from '@src/providers/AuthProvider';

const AuthSwitchScreen = () => {
  const { accountId } = useLocalSearchParams<{ accountId: string }>();
  const [accountToken, setAccountToken] = useState('');
  const [prevService, setPrevService] = useState<AccountType|null>(null);
  const [isQueryEnabled, setIsQueryEnabled] = useState(false);
  const [connection, setConnection] = useState<Connection|null>(null);

  const router = useRouter();
  const navigation = useNavigation();
  const api = useApi();
  const authContext = useAuth();
  const {findConnection, saveConnection} = useConnections();

  const {
    data: user,
    error,
    invalidateQuery,
  } = useAuthQuery(accountToken, isQueryEnabled);

  useEffect(() => {
    const onAccountNotFound = () => {
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity(
          `Chosen account not found.`,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      }
  
      router.back();
    }

    const loadConnection = async () => {
      if (!accountId) {
        onAccountNotFound();
        return;
      }

      const conn = await findConnection(accountId);

      if (!conn) {
        onAccountNotFound();
        return;
      }

      setConnection(conn);
    }

    loadConnection();
  }, []);

  useEffect(() => {
    const loadAccountToken = async (accountId: string) => {
      const token = await authContext?.loadAccountToken(accountId ?? '');
      setAccountToken(token ?? '');
    }

    if (!connection || !api?.setService) {
      return;
    }

    setPrevService(api.service);
    api.setService(connection.service);
    loadAccountToken(connection.account_id);
  }, [connection]);

  useEffect(() => {
    if (!accountToken) {
      return;
    }

    setIsQueryEnabled(true);
  }, [accountToken]);

  useEffect(() => {
    const initializeUser = async (user: User, conn: Connection) => {
      authContext?.setUser(user);
      await invalidateQuery();
      authContext?.setActiveAccount(conn.account_id);
    }
    
    if (user && connection) {
      initializeUser(user, connection);
    }
  }, [user]);

  useEffect(() => {
    if (!authContext?.accountId) {
      return;
    }

    if (!isQueryEnabled) {
      return;
    }
    
    navigation.reset({
      index: 0,
      routes: [{ name: '(main)/(drawer)' } as never],
    });
  }, [authContext?.accountId]);

  useEffect(() => {
    const updateExpiredConnection = async (conn: Connection) => {
      await saveConnection({ ...conn, expired: true });
      await invalidateQuery();
    }

    if (!error || !connection) {
      return;
    }
    
    updateExpiredConnection(connection).then(() => {
      if (api?.setService && prevService) {
        api.setService(prevService);
      }

      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity(
          `Token to chosen account in no longer valid.`,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      }

      router.back();
    }).catch((err) => console.error(err));
  }, [error]);

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Image source={require('@assets/img/icon.png')} style={{ width: 150, height: 150 }} resizeMode="center" />
        <View style={{ gap: 8 }}>
          <Text style={styles.centerText}>Switching account</Text>
          {connection ? (
            <ConnectionItem connection={connection} interactable={false} />
          ) : ''}
        </View>
      </View>
      {connection ? <ActivityIndicator size="large" color="black" style={styles.loadingIndicator} /> : ''}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    margin: 32
  },

  centerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  loadingIndicator: {
    position: 'absolute',
    bottom: 72,
  }
})

export default AuthSwitchScreen