import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";

import BaseHeader from "@src/components/BaseHeader";
import ConnectionHeader from "@src/components/ConnectionHeader";
import useActiveAccount from "@src/hooks/useActiveAccount";
import PastableTextarea from "@src/components/PastableTextarea";
import PrimaryButton from "@src/components/buttons/PrimaryButton";
import { Connection } from "@src/types";

const Page = () => {
  const [connection, setConnection] = useState<Connection|null>(null);
  const [accessToken, setAccessToken] = useState('');
  const {connectionId} = useLocalSearchParams();
  const {accountId} = useActiveAccount();
  const router = useRouter();

  useEffect(() => {
    console.log(accessToken);
  }, [accessToken]);

  useEffect(() => {
    loadConnection();
  }, [])

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

  function onAccessTokenTextChanged(text: string) {
    setAccessToken(text);
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
              lines={7}
              onChangeText={onAccessTokenTextChanged} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8}}>
            <PrimaryButton style={{ minWidth: 100, backgroundColor: '#ef4444' }}>
              <Text style={{ color: 'white' }}>Remove Connection</Text>
            </PrimaryButton>
            <PrimaryButton style={{ width: 100 }}>
              <Text style={{ color: 'white' }}>Save</Text>
            </PrimaryButton>          
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
    paddingVertical: 32
  }
});

export default Page;
