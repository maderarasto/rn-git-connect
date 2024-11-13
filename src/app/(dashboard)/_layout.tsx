import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Drawer } from 'expo-router/drawer'
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import {MaterialIcons, FontAwesome, Ionicons, Octicons} from '@expo/vector-icons';

import { DialogMethods } from '@src/components/dialogs/Dialog';
import { AccountType } from '@src/api/types';
import { slug } from '@src/utils/strings';
import DrawerHeader from '@src/components/DrawerHeader';
import useConnections, { Connection } from '@src/hooks/useConnections';
import ConnectionItem from '@src/components/ConnectionItem';
import { useAuth } from '@src/providers/AuthProvider';
import ConnectionButton from '@src/components/buttons/ConnectionButton';
import AccountTypeDialog from '@src/components/dialogs/AccountTypeDialog';
import UserCard from '@src/components/UserCard';
import { useApi } from '@src/providers/ApiProvider';

type DrawerContentProps = DrawerContentComponentProps & {
  dialogRef?:  React.RefObject<DialogMethods>
}


const DrawerContent = ({
  dialogRef,
  ...props
}: DrawerContentProps)  => {
  const [connections, setConnections] = useState<Connection[]>([]);
  
  const authContext = useAuth();
  const router = useRouter();
  const {getConnections} = useConnections();

  useEffect(() => {
    const loadConnections = async () => {
      setConnections(await getConnections());
    }
    
    loadConnections();
  }, []);
  
  const onAddConnectionPress = () => {
    props.navigation.closeDrawer();
    dialogRef?.current?.show();
  }

  const onProfilePress = () => {
    props.navigation.closeDrawer();
    router.navigate('manage/profile/(tabs)');
  }


  if (!authContext?.user) {
    return null;
  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#dedede', flex: 1, }}>
      <View style={styles.drawerHeader}>
        <Image source={require('@assets/img/icon.png')} style={styles.drawerHeaderLogo} />
        <Text style={styles.drawerHeaderTitle}>Git Connect</Text>
      </View>
      <View style={styles.drawerSectionDivider}>
        <DrawerItemList {...props} />
      </View>
      <View style={styles.drawerSection}>
        <View style={styles.drawerSectionHeader}>
          <Text style={styles.drawerSectionLabel}>Connections {connections.length}/5</Text>
          <View style={styles.drawerSectionActions}>
            
          </View>
        </View>
        <View style={{ flex: 1,}}>
          {connections.map((connection) => (
            <ConnectionItem 
              key={connection.account_id} 
              connection={connection}
              interactable={connection.account_id !== authContext?.accountId} 
              active={connection.account_id === authContext?.accountId} />
          ))}
          <ConnectionButton onPress={onAddConnectionPress} />
        </View>
      </View>
      <View>
        <TouchableOpacity style={styles.drawerSectionUser} onPress={onProfilePress}>
          <UserCard user={authContext?.user} style={{ flex: 1, }} />
          <FontAwesome name="angle-right" size={30} color="gray" />
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );

}

const DrawerLayout = () => {
  const router = useRouter();
  const {api} = useApi();
  const dialogRef = useRef<DialogMethods>(null);

  function onAccountTypeChoose(accountType: AccountType) {
    if (!dialogRef.current) {
      return;
    }

    dialogRef.current.hide();
    setTimeout(() => {
      if (!api) {
        throw new Error('Missing API resolver!');
      }

      api.activeService = accountType;
      router.navigate(`(auth)/pat?type=${slug(accountType)}`);
    }, 150);
  }


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer 
        drawerContent={(props) => <DrawerContent {...{ ...props, dialogRef }} />}
        screenOptions={{
          header: ({ navigation, route, options }) => (
            <DrawerHeader 
              navigation={navigation}
              title={options.title} />
          ),
          drawerLabelStyle: styles.drawerLabel,
      }}>
        <Drawer.Screen
          name="index"
          options={{
            title: "Dasbhoard",
            drawerIcon: ({color}) => <MaterialIcons name="dashboard" size={24} color={color} />
          }}
        />
        <Drawer.Screen
          name="repositories"
          options={{
            title: "Repositories",
            drawerIcon: ({color}) => <Ionicons name="layers" size={24} color={color} />
          }}
        />
        <Drawer.Screen
          name="merge-requests"
          options={{
            title: "Merge Requests",
            drawerIcon: ({color}) => <Ionicons name="git-merge" size={24} color={color} />
          }}
        />
        <Drawer.Screen
          name="issues"
          options={{
            title: "Issues",
            drawerIcon: ({color}) => <Octicons name="issue-opened" size={24} color={color} />
          }}
        />

      </Drawer>
      <AccountTypeDialog 
        ref={dialogRef} 
        title="Select account type" 
        onTypeChoose={onAccountTypeChoose} />

    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  drawerHeader: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    height: 50, 
    paddingHorizontal: 15, 
  },

  drawerHeaderLogo: {
    width: 30,
    height: 30,
  },

  drawerHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  drawerSectionDivider: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#6b7280',
  },

  drawerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  drawerSection: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#6b7280',
  },

  drawerSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  drawerSectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  drawerSectionLabel: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
    color: '#6b7280',
  },

  drawerSectionDefaultMessage: { 
    padding: 8, 
    textAlign: 'center', 
    color: 'gray'
  },

  drawerSectionUser: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingRight: 16,
    paddingVertical: 6,
  }
})

export default DrawerLayout