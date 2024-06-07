import { View, Text } from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import {MaterialIcons, Ionicons, Octicons} from '@expo/vector-icons';
import { DrawerItem } from "@react-navigation/drawer";

const Layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            title: "Dasbhoard",
            drawerIcon: () => <MaterialIcons name="dashboard" size={24} color="black" />
          }}
        />
        <Drawer.Screen
          name="repositories/index"
          options={{
            title: "Repositories",
            drawerIcon: () => <Ionicons name="layers" size={24} color="black" />
          }}
        />
        <Drawer.Screen
          name="merge-requests/index"
          options={{
            title: "Merge Requests",
            drawerIcon: () => <Ionicons name="git-merge" size={24} color="black" />
          }}
        />
        <Drawer.Screen
          name="issues/index"
          options={{
            title: "Issues",
            drawerIcon: () => <Octicons name="issue-opened" size={24} color="black" />
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default Layout;
