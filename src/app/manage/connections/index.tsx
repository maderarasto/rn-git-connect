import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import {AntDesign} from '@expo/vector-icons';

import BaseHeader from '@src/components/BaseHeader'
import { useRouter } from 'expo-router';
import useActiveAccount from '@src/hooks/useActiveAccount';
import { useEffect, useState } from 'react';
import { Connection } from '@src/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConnectionItem from '@src/components/ConnectionItem';

const Page = () => {
  const [connections, setConnections] = useState<Record<string, Connection>|null>(null); 
  const {accountId} = useActiveAccount();
  const router = useRouter();
  
  useEffect(() => {
    loadConnections();
  }, []);

  async function loadConnections() {
    let loadedConnections: unknown = await AsyncStorage.getItem('connections');
      
    if (typeof loadedConnections === 'string') {
      loadedConnections = JSON.parse(loadedConnections);
    }
    
    setConnections(loadedConnections as Record<string, Connection>);
  }

  function onBackPress() {
    router.back();
  }

  return (
    <View style={styles.container}>
      <BaseHeader options={{
        headerLeft: () => (
          <TouchableOpacity onPress={onBackPress}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <>
            {connections && Object.keys(connections).length < 5 ? (
              <TouchableOpacity>
              <AntDesign name="plus" size={24} color="black" />
            </TouchableOpacity>
            ) : ''} 
          </>
        ),
        title: 'Your Connections'
      }} />
      <View style={styles.contentContainer}>
        <Text style={styles.subtitle}>Connections {connections ? Object.keys(connections).length : 0}/5</Text>
        <View>
          {connections ? Object.entries(connections).map(([connectionId, connection]) => (
            <ConnectionItem key={connectionId} connection={connection} active={connectionId === accountId} size="large" />
          )) : ''}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    flex: 1,
    padding: 16,
  },

  subtitle: {
    fontSize: 12, 
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
    color: '#6b7280',
  }
})

export default Page