import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import {MaterialIcons, Ionicons, Octicons} from '@expo/vector-icons';
import { View, Text, Image } from "react-native";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";

const DrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, height: 50, paddingHorizontal: 15, }}>
        <Image source={require('@assets/img/icon.png')} style={{ width: 30, height: 30}} />
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Git Connect</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const Layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={DrawerContent} screenOptions={{
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        }
      }}>
        <Drawer.Screen
          name="index"
          options={{
            title: "Dasbhoard",
            drawerIcon: () => <MaterialIcons name="dashboard" size={24} color="#a4a4a4" />
          }}
        />
        <Drawer.Screen
          name="repositories/index"
          options={{
            title: "Repositories",
            drawerIcon: () => <Ionicons name="layers" size={24} color="#a4a4a4" />
          }}
        />
        <Drawer.Screen
          name="merge-requests/index"
          options={{
            title: "Merge Requests",
            drawerIcon: () => <Ionicons name="git-merge" size={24} color="#a4a4a4" />
          }}
        />
        <Drawer.Screen
          name="issues/index"
          options={{
            title: "Issues",
            drawerIcon: () => <Octicons name="issue-opened" size={24} color="#a4a4a4" />
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default Layout;
