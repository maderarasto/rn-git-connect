import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '@src/providers/AuthProvider'

const MergeRequestsScreen = () => {
  const authContext = useAuth();

  if (!authContext) {
    return null;
  }

  return (
    <View>
      <Text>Merge Requests</Text>
    </View>
  )
}

export default MergeRequestsScreen