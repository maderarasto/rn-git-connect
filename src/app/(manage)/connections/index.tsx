import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BaseHeader from '@src/components/BaseHeader';
import { useRouter } from 'expo-router';
import {AntDesign} from '@expo/vector-icons';
import useConnections, { Connection } from '@src/hooks/useConnections';
import { useAuth } from '@src/providers/AuthProvider';
import ConnectionItem from '@src/components/ConnectionItem';
import PrimaryButton from '@src/components/buttons/PrimaryButton';
import colors from '@src/utils/colors';
import AccountTypeDialog from '@src/components/dialogs/AccountTypeDialog';
import { DialogMethods } from '@src/components/dialogs/Dialog';
import { AccountType } from '@src/api/types';
import { useApi } from '@src/providers/ApiProvider';
import { slug } from '@src/utils/strings';

const ConnectionsScreen = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  
  const dialogRef = useRef<DialogMethods>(null);
  const router = useRouter();
  const {api} = useApi();
  const authContext = useAuth();
  const {getConnections} = useConnections();

  useEffect(() => {
    const loadConnections = async () => {
      const loadedConnections = await getConnections();
      setConnections(loadedConnections);
    }

    loadConnections();
  }, []);

  const openConnection = (conn: Connection) => {
    router.navigate(`(manage)/connections/${conn.account_id}`);
  }

  const onBackPress = () => {
    router.back();
  }

  const onAddConnectionPress = () => {
    dialogRef.current?.show();
  }

  const onAccountTypeChoose = (accountType: AccountType) => {
    if (!api) {
      throw new Error('Missing API resolver!');
    }

    api.activeService = accountType;
    dialogRef.current?.hide();
    
    setTimeout(() => {
      router.navigate(`auth/pat?type=${slug(accountType)}`);
    }, 150);
  }

  return (
    <View style={styles.container}>
      <BaseHeader options={{
        headerLeft: () => (
          <TouchableOpacity onPress={onBackPress}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
        ),
        title: 'Your Connections'
      }} />
      <View style={styles.contentContainer}>
        <Text style={styles.subtitle}>Connections {connections.length}/5</Text>
        <FlatList
          data={connections}
          style={{ marginBottom: 10, }}
          renderItem={({item}) => (
            <ConnectionItem 
              key={item.account_id} 
              connection={item}
              onPress={() => openConnection(item)} 
              active={item.account_id === authContext?.accountId} 
              size="large" />
          )} />
          <PrimaryButton 
            text='Add new connection'
            icon={<AntDesign name="plus" size={20} color="white" />}
            style={{ backgroundColor: colors.primary }}
            onPress={onAddConnectionPress} />
      </View>
      <AccountTypeDialog 
        ref={dialogRef} 
        title="Select account type" 
        onTypeChoose={onAccountTypeChoose} />
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

});

export default ConnectionsScreen