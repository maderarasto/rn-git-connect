import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import {AntDesign, FontAwesome6} from '@expo/vector-icons';

import { AccountType, Connection } from '@src/types'

type ConnectionItemProps = {
  connection: Connection,
  active?: boolean
  expired?: boolean
}

const ConnectionItem = ({
  connection,
  active = false,
  expired = false,
}: ConnectionItemProps) => {
  function resolveIcon() {
    let iconEl = <AntDesign name="question" size={24} color="black" />

    if (connection.type === 'GitHub') {
      iconEl = <AntDesign name="github" size={24} color="#1e293b" />
    } else if (connection.type === 'GitLab') {
      iconEl = <AntDesign name="gitlab" size={24} color="#ea580c" />
    }

    return iconEl;
  }

  function resolveConnectionDetails() {
    return (
      <View style={{ flex: 1, }}>
          <Text style={styles.textUsername}>{connection.username}</Text>
          <Text style={styles.textDisplayName}>{connection.email}</Text>
        </View>
    );
  }

  if (active) 
    return (
      <View style={styles.container}>
        {resolveIcon()}
        {resolveConnectionDetails()}
        {active ? <FontAwesome6 name="plug-circle-check" size={16} color="#16a34a" /> : ''}
      </View>
    )

  return (
    <TouchableOpacity style={styles.container}>
      {resolveIcon()}
      {resolveConnectionDetails()}
      {expired ? <FontAwesome6 name="plug-circle-exclamation" size={16} color="#ef4444" /> : ''}
    </TouchableOpacity>
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