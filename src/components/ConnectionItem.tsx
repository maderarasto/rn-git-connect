import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import {AntDesign} from '@expo/vector-icons';

import { AccountType } from '@src/types'

type ConnectionItemProps = {
  type: AccountType
  username: string
  displayName: string
}

const ConnectionItem = ({
  type,
  username,
  displayName
}: ConnectionItemProps) => {
  function resolveIcon() {
    let iconEl = <AntDesign name="question" size={24} color="black" />

    if (type === 'GitHub') {
      iconEl = <AntDesign name="github" size={24} color="#1e293b" />
    } else if (type === 'GitLab') {
      iconEl = <AntDesign name="gitlab" size={24} color="#ea580c" />
    }

    return iconEl;
  }

  return (
    <View style={styles.container}>
      {resolveIcon()}
      <View>
        <Text style={styles.textUsername}>{username}</Text>
        <Text style={styles.textDisplayName}>{displayName}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    paddingHorizontal: 8, 
    paddingVertical: 8
  },

  textUsername: {
    marginBottom: -2,
    fontWeight: 'bold',
    color: '#333'
  },

  textDisplayName: {
    fontSize: 12,
    color: 'gray',
  }
})

export default ConnectionItem