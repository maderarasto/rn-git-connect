import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '@src/providers/AuthProvider'

const RepositoriesScreen = () => {
  const authContext = useAuth();

  if (!authContext) {
    return null;
  }

  return (
    <View>
      <Text>Repositories</Text>
    </View>
  )
}

export default RepositoriesScreen