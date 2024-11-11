import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '@src/providers/AuthProvider'

const DashboardScreen = () => {
  const authContext = useAuth();

  if (!authContext) {
    return null;
  }

  return (
    <View>
      <Text>DashboardScreen</Text>
    </View>
  )
}

export default DashboardScreen