import { ActivityIndicator, Image, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { AccountType, Connection, User } from '@src/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ConnectionItem from '@src/components/ConnectionItem'
import useAuthQuery from '@src/hooks/useAuthQuery'
import useConnection from '@src/hooks/useConnection'
import { AuthUserContext } from '@src/context/AuthUserContext'
import { saveAccount, updateConnection } from '@src/utils'

const Page = () => {
  let {accountId} = useLocalSearchParams();
  const [queryEnabled, setQueryEnabled] = useState(false);

  const router = useRouter();
  const authUserContext = useContext(AuthUserContext);

  if (!authUserContext) {
    throw new Error('AuthUserContext must be used withing AUthUserProvider!');
  }
  
  if (!accountId) {
    router.back();
  }

  const navigation = useNavigation();
  const {connection, accountToken} = useConnection(accountId as string);
  const {
    data: authUser, 
    isLoading, 
    error,
    authToken,
    setAuthToken, 
    invalidateQuery,
  } = useAuthQuery(connection?.type as AccountType, '', queryEnabled);

  useEffect(() => {
    if (!connection || !accountToken) {
      return;
    }

    setAuthToken(accountToken);
  }, [connection]);

  useEffect(() => {
    if (!authToken) {
      return;
    }

    setQueryEnabled(true);
  }, [authToken]);

  useEffect(() => {
    if (!error || !connection) {
      return;
    }

    if ('error' in error && error.error === 'invalid_token') {
      updateConnection(connection, true);
      ToastAndroid.show(`The token for the account "${connection.type.toLowerCase()}@${connection.username}" has expired`, ToastAndroid.LONG);
      navigation.reset({
        index: 0,
        routes: [{ name: 'dashboard'} as never]
      });
    }
  }, [error]);

  useEffect(() => {
    if (authUser && connection) {
      switchAccount(authUser);
    }
  }, [authUser]);

  async function switchAccount(authUser: User) {
    if (!connection) {
      return;
    }

    await AsyncStorage.setItem('active_account_id', connection.accountId);
    await invalidateQuery(true);
    authUserContext?.setUser(authUser);
    ToastAndroid.show(`Signed as ${connection.type.toLowerCase()}@${connection.username}`, ToastAndroid.LONG);
    navigation.reset({
      index: 0,
      routes: [{ name: 'dashboard'} as never]
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Image source={require('@assets/img/icon.png')} style={{ width: 150, height: 150 }} resizeMode="center" />
        <View style={{ gap: 8 }}>
          <Text style={styles.centerText}>Switching account</Text>
          {connection ? (<ConnectionItem connection={connection as Connection} interactable={false} />) : ''}
        </View>
      </View>
      {connection ? <ActivityIndicator size="large" color="black" style={styles.loadingIndicator} /> : ''}
    </SafeAreaView>
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
    bottom: 48,
  }
})

export default Page