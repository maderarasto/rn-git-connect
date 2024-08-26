import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Keyboard } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";

import BaseHeader from "@src/components/headers/BaseHeader";
import ConnectionHeader from "@src/components/headers/ConnectionHeader";
import useActiveAccount from "@src/hooks/useActiveAccount";
import PastableTextarea from "@src/components/input/PastableTextarea";
import PrimaryButton from "@src/components/buttons/PrimaryButton";
import { AccountType, Connection } from "@src/types";
import useAuthQuery from "@src/hooks/useAuthQuery";
import { getAccountToken, removeConnection, saveAccountToken, saveConnection } from "@src/utils";

const Page = () => {
  const [connection, setConnection] = useState<Connection|null>(null);
  const [queryEnabled, setQueryEnabled] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  const {connectionId} = useLocalSearchParams();
  const {accountId} = useActiveAccount();
  const {
    data: authUser,  
    isFetching,
    error,
    authToken,
    setAuthToken, 
    invalidateQuery,
  } = useAuthQuery(connection?.type as AccountType, '', queryEnabled);

  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    loadConnection();
  }, []);

  useEffect(() => {
    if (!connection) {
      return;
    }

    getAccountToken(connection.accountId).then((accountToken) => {
      if (!accountToken) {
        return;
      }

      setAccessToken(accountToken);
    });
  }, [connection]);

  useEffect(() => {
    if (!authToken) {
      return;
    }
    
    setQueryEnabled(true);
  }, [authToken]);

  useEffect(() => {
    if (!authUser) {
      return;
    }

    updateConnection();
  }, [authUser]);

  useEffect(() => {
    if (!error) {
      return;
    }

    setQueryEnabled(false);
  }, [error]);

  async function loadConnection() {
    let loadedConnections: unknown = await AsyncStorage.getItem('connections');
      
    if (typeof loadedConnections === 'string') {
      loadedConnections = JSON.parse(loadedConnections) as Connection;
    }
    
    const foundConnection = (loadedConnections as Record<string, Connection>)[connectionId as string];
    
    if (foundConnection) {
      setConnection(foundConnection);
    }
  }

  function resolveConnectionStatus() {
    if (connection?.accountId === accountId) {
      return (
        <>
          <FontAwesome6 name="plug-circle-exclamation" size={20} color="#16a34a" />
          <Text style={{ ...styles.statusText,  color: '#16a34a'}}>Connected</Text>
        </>
      )
    }

    if (connection?.expired) {
      return (
        <>
          <FontAwesome6 name="plug-circle-exclamation" size={20} color="#ef4444" />
          <Text style={{ ...styles.statusText, color: '#ef4444'}}>Expired</Text>
        </>
      )
    }

    return '';
  }

  function resolveError() {
    let errorMessage = '';

    if (!error) {
      return errorMessage;
    }

    const isGithubAuthError = 'status' in error && error.status === '401';
    const isGitlabAuthError = error.message?.includes('401') ?? false;

    if (isGithubAuthError || isGitlabAuthError) {
      errorMessage = 'Personal Access Token is invalid!';
    } else if ('error' in error && error.error === 'invalid_token') {
      errorMessage = 'Token was revoked. You have to re-authorize from the user.';
    } else {
      errorMessage = error.message;
    }

    return errorMessage;
  }

  async function updateConnection() {
    if (!connection) {
      return;
    }

    await saveAccountToken(connection.accountId, accessToken);
    await saveConnection(connection, false);
    navigation.reset({
      index: 0,
      routes: [
        { name: 'dashboard'} as never,
        { name: 'manage/connections/index' } as never,
      ]
    });
  }

  function onAccessTokenTextChanged(text: string) {
    setAccessToken(text);
  }

  function onAccessTokenClear() {
    setAuthToken('');
  }

  async function onSavePress() {
    Keyboard.dismiss();
    await invalidateQuery();
    setAuthToken(accessToken);
  }

  async function onRemovePress() {
    if (!connection) {
      return;
    }

    await removeConnection(connection.accountId);
    navigation.reset({
      index: 0,
      routes: [
        { name: 'dashboard'} as never,
        { name: 'manage/connections/index' } as never,
      ]
    });
  } 

  function onBackPress() {
    router.back();
  }

  return (
    <View style={styles.container}>
      <BaseHeader
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={onBackPress}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
          title: "Connection Details",
        }}
      />
      {connection ? (
        <View style={styles.contentContainer}>
          <View>
            <ConnectionHeader connection={connection} active={connection.accountId === accountId} />
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, height: 56, paddingVertical: 16 }}>
              {resolveConnectionStatus()}
            </View>
          </View>
          <View style={styles.pat}>
            <PastableTextarea 
              label="Personal Access Token" 
              placeholder="Enter personal access token..."
              value={accessToken}
              errorText={resolveError()}
              lines={4}
              allowActions={connection.accountId !== accountId}
              readOnly={connection.accountId === accountId}
              onChangeText={onAccessTokenTextChanged}
              onClear={onAccessTokenClear} />
          </View>
          <View style={{ gap: 16 }}>
            {isFetching ? (
              <ActivityIndicator size="large" color="#2563eb" />
            ) : '' }
            
              {connection.accountId !== accountId ? (
                <View style={styles.buttonsRow}>
                  <PrimaryButton style={{ minWidth: 100, backgroundColor: '#ef4444' }} onPress={onRemovePress}>
                    <Text style={{ color: 'white' }}>Remove Connection</Text>
                  </PrimaryButton>
                  <PrimaryButton style={{ width: 100 }} onPress={onSavePress}>
                    <Text style={{ color: 'white' }}>Save</Text>
                  </PrimaryButton>
                </View>
              ) : '' }      
          </View>
      </View>
      ) : ''}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 32,
  },

  statusText: {
    fontSize: 18, 
    fontWeight: 'bold',
  },

  pat: {
    flex: 1,
    gap: 12,
    paddingVertical: 24
  },

  buttonsRow: {
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    gap: 8
  }
});

export default Page;
