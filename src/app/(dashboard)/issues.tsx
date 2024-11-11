import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '@src/providers/AuthProvider'

const IssuesScreen = () => {
  const authContext = useAuth();

  if (!authContext) {
    return null;
  }

  return (
    <View>
      <Text>Issues</Text>
    </View>
  )
}

export default IssuesScreen