import React, { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import {MaterialIcons, Ionicons, Octicons, AntDesign} from '@expo/vector-icons';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import DrawerHeader from "@src/components/DrawerHeader";
import ConnectionItem from "@src/components/ConnectionItem";
import ConnectionButton from "@src/components/buttons/ConnectionButton";
import AccountTypeDialog from "@src/components/dialogs/AccountTypeDialog";
import { DialogMethods } from "@src/components/dialogs/Dialog";
import { AccountType, Connection } from "@src/types";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { convertToSlug } from "@src/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useActiveAccount from "@src/hooks/useActiveAccount";

type DrawerContentProps = DrawerContentComponentProps & {
  dialogRef?:  React.RefObject<DialogMethods>
}

const DrawerContent = ({
  dialogRef,
  ...props
}: DrawerContentProps) => {
  const {navigation} = props;

  const [connections, setConnections] = useState<Record<string, Connection>|null>(null); 
  const {accountId} = useActiveAccount();
  
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

  function onAddConnectionPress() {
    navigation.closeDrawer();
    dialogRef?.current?.show();
  }

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: '#dedede'}}>
      <View style={styles.drawerHeader}>
        <Image source={require('@assets/img/icon.png')} style={styles.drawerHeaderLogo} />
        <Text style={styles.drawerHeaderTitle}>Git Connect</Text>
      </View>
      <View style={styles.drawerScreensContainer}>
        <DrawerItemList {...props} />
      </View>
      <View style={styles.drawerSection}>
        <View style={styles.drawerSectionHeader}>
          <Text style={styles.drawerSectionLabel}>Connections {connections ? Object.keys(connections).length : 0}/5</Text>
          <View style={styles.drawerSectionActions}>
            <TouchableOpacity>
              <MaterialIcons name="settings" size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          {connections ? Object.entries(connections).map(([connectionId, connection]) => (
            <ConnectionItem key={connectionId} connection={connection} active={connectionId === accountId} />
          )) : ''}
          <ConnectionButton onPress={onAddConnectionPress} />
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

const Layout = () => {
  const router = useRouter();
  const dialogRef = useRef<DialogMethods>(null);

  function onAccountTypeChoose(accountType: AccountType) {
    if (!dialogRef.current) {
      return;
    }

    dialogRef.current.hide();
    setTimeout(() => {
      router.navigate(`auth/pat?type=${convertToSlug(accountType)}`);
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
          name="repositories/index"
          options={{
            title: "Repositories",
            drawerIcon: ({color}) => <Ionicons name="layers" size={24} color={color} />
          }}
        />
        <Drawer.Screen
          name="merge-requests/index"
          options={{
            title: "Merge Requests",
            drawerIcon: ({color}) => <Ionicons name="git-merge" size={24} color={color} />
          }}
        />
        <Drawer.Screen
          name="issues/index"
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
  );
};

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

  drawerScreensContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#6b7280',
  },

  drawerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  drawerSection: {
    padding: 10,
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
  }
})

export default Layout;
