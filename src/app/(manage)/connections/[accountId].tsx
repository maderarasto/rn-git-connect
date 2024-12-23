import { View, Text, StyleSheet, Keyboard, TouchableWithoutFeedback, Platform, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { FontAwesome6 } from '@expo/vector-icons';

import useConnections, { Connection } from '@src/hooks/useConnections';
import BaseHeader from '@src/components/headers/BaseHeader';
import BackButton from '@src/components/buttons/BackButton';
import PrimaryButton from '@src/components/buttons/PrimaryButton';
import { useAuth } from '@src/providers/AuthProvider';
import colors from '@src/utils/colors';
import ConnectionHeader from '@src/components/ConnectionHeader';
import PastableTextarea from '@src/components/inputs/PastableTextarea';
import useAuthQuery from '@src/hooks/query/useAuthQuery';
import { useApi } from '@src/providers/ApiProvider';

const UNAUTHORIZED_MESSAGES = [
  'Bad credentials',
  '401 Unauthorized',
];

const EditConnectionScreen = () => {
  const {accountId} = useLocalSearchParams<{accountId: string}>();
  
  const [connection, setConnection] = useState<Connection|null>(null);
  const [isQueryEnabled, setIsQueryEnabled] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  const router = useRouter();
  const navigation = useNavigation();
  const api = useApi();
  const authContext = useAuth();
  
  const {
    findConnection, 
    saveConnection,
    removeConnection
  } = useConnections();

  const {
    data: user,
    error,
    isFetching,
    invalidateQuery,
  } = useAuthQuery(accessToken, isQueryEnabled);

  useEffect(() => {
    if (!accountId) {
      return;
    }

    const loadConnection = async () => {
      const conn = await findConnection(accountId);

      if (!conn) {
        if (Platform.OS === 'android') {
          ToastAndroid.showWithGravity(
            `Missing account ID.`,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        }

        router.back();
        return;
      }

      if (api.setService) {
        api.setService(conn.service)
      }

      setConnection(conn);
      
      const loadedToken = await authContext?.loadAccountToken(conn.account_id);

      if (loadedToken) {
        setAccessToken(loadedToken);
      }
    }

    loadConnection();

  }, [accountId]);

  useEffect(() => {
    const updateConnection = async (conn: Connection) => {
      if (!authContext) {
        return;
      }

      await invalidateQuery();
      await authContext.saveAccountToken(conn.account_id, accessToken);
      await saveConnection({ ...conn, expired: false});

      navigation.reset({
        index: 0,
        routes: [
          { name: 'dashboard'} as never,
          { name: '(manage)/connections/index' } as never,
        ]
      });  
    }

    if (!user || !connection) {
      return;
    }

    updateConnection(connection);
  }, [user])

  useEffect(() => {
    if (error) {
      setIsQueryEnabled(false);
    }
  }, [error]);

  const resolveConnectionStatus = () => {
    if (connection?.account_id === authContext?.accountId) {
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

  const resolveError = () => {
    if (!error) {
      return '';
    }

    if (UNAUTHORIZED_MESSAGES.includes(error.message)) {
      return 'Your token is invalid!';
    }

    return error.message;
  }

  const onAccessTokenTextChanged = (text: string) => {
    setAccessToken(text);
  }

  const onAccessTokenClear = () => {
    setAccessToken('');
  }


  async function onSavePress() {
    Keyboard.dismiss();
    await invalidateQuery();
    setIsQueryEnabled(true);
  }

  async function onRemovePress() {
    if (!connection) {
      return;
    }

    await removeConnection(connection);

    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(
        `Connection removed.`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }

    navigation.reset({
      index: 0,
      routes: [
        { name: 'dashboard'} as never,
        { name: '(manage)/connections/index' } as never,
      ]
    });
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
       <BaseHeader
        options={{
          headerLeft: () =>  <BackButton />,
          title: "Connection Details",
        }} />
        {connection ? (
          <View style={styles.contentContainer}>
            <View>
              <ConnectionHeader 
                connection={connection} 
                active={connection.account_id === authContext?.accountId} />
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
                allowActions={connection.account_id !== authContext?.accountId}
                readOnly={connection.account_id === authContext?.accountId}
                onChangeText={onAccessTokenTextChanged}
                onClear={onAccessTokenClear} />
            </View>
            <View style={{ gap: 32 }}>
              {isFetching ? (
                <ActivityIndicator size="large" color="#2563eb" />
              ) : '' }
              
              {connection.account_id !== authContext?.accountId ? (
                <View style={styles.buttonsRow}>
                  <PrimaryButton 
                    text="Remove connection"
                    textStyle={{ color: 'white'}}
                    style={{ minWidth: 100, backgroundColor: '#ef4444' }} 
                    onPress={onRemovePress} />
                  <PrimaryButton 
                    text="Save"
                    textStyle={{ color: 'white'}}
                    style={{ width: 100, backgroundColor: colors.primary }} 
                    onPress={onSavePress} />
                </View>
              ) : '' }      
            </View>
        </View>
        ) : ''}
      </View>
    </TouchableWithoutFeedback>
  )
}

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

})

export default EditConnectionScreen