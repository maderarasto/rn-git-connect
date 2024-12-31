import { StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import { Tabs, useRouter } from 'expo-router'
import {AntDesign, FontAwesome5} from '@expo/vector-icons';

const TabLayout = () => {
  const router = useRouter();
  
  async function onBackPress() {
    router.back();
  }

  return (
    <Tabs screenOptions={{
      tabBarStyle: styles.tabsContainer,
      tabBarLabelStyle: { fontSize: 14, },
      tabBarActiveTintColor: "#2563eb",
      headerStyle: {
        backgroundColor: '#dedede',
      },
      headerLeftContainerStyle: {
        paddingLeft: 17
      },
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity onPress={onBackPress}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
      )
    }}>
      <Tabs.Screen 
        name="index"
        options={{
          title: 'Your Profile',
          tabBarIcon: ({focused}) => (
            <FontAwesome5 name="user-circle" size={24} color={focused ? '#2563eb' : 'gray' } />
          )
        }} />
      <Tabs.Screen 
        name="activities"
        options={{
          title: 'Activity',
          tabBarIcon: ({focused}) => (
            <FontAwesome5 name="history" size={22} color={focused ? '#2563eb' : 'gray' } />
          )
        }} />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabsContainer: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    width: 250,
    height: 70,
    borderRadius: 16,
    marginBottom: 12,
    paddingTop: 4,
    paddingHorizontal: 24,
    paddingBottom: 8,
    transform: [{
      translateX: -125,
    }]
  }
})

export default TabLayout
