import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import React from 'react'
import {AntDesign, FontAwesome6} from '@expo/vector-icons';

import { useRouter } from 'expo-router';
import { Connection } from '@src/hooks/useConnections';

type ConnectionItemProps = {
  connection: Connection,
  onPress?: () => void,
  interactable?: boolean
  active?: boolean
  size?: 'small'|'large'
  expired?: boolean,
}

const ConnectionItem = ({
  connection,
  onPress,
  interactable = true,
  active = false,
  size = 'small',
}: ConnectionItemProps) => {
  const router = useRouter();

  function resolveIconSize() {
    return size === 'large' ? 36 : 32;
  }

  function resolveIcon() {
    let iconEl = <AntDesign name="question" size={resolveIconSize()} color="black" />

    if (connection.service === 'Github') {
      iconEl = <AntDesign name="github" size={resolveIconSize()} color="#1e293b" />
    } else if (connection.service === 'Gitlab') {
      iconEl = <AntDesign name="gitlab" size={resolveIconSize()} color="#ea580c" />
    }

    return iconEl;
  } 

  function resolveConnectionDetails() {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.textFullname}>{connection.fullname}</Text>
        <Text style={styles.textUsername}>@{connection.username}</Text>
      </View>
    );
  }

  function resolveTouchableStyle() {
    let style: ViewStyle = {
      ...styles.container,
    }

    if (connection.expired) {
      style.opacity = 0.6;
    }

    return style;
  }

  if (!interactable)
    return (
      <View style={styles.container}>
        {resolveIcon()}
        {resolveConnectionDetails()}
        {active ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <FontAwesome6 name="plug-circle-check" size={16} color="#16a34a" />
            {size === 'large' ? <Text style={{ fontWeight: 'bold', color: '#16a34a'}}>Connected</Text> : ''}
          </View>
        ) : ''}
      </View>
    )
  
  return (
    <TouchableOpacity style={resolveTouchableStyle()} onPress={onPress}>
      {resolveIcon()}
      {resolveConnectionDetails()}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        {connection.expired ? (
          <>
            <FontAwesome6 name="plug-circle-exclamation" size={16} color="#ef4444" />
            {size === 'large' ? <Text style={{ fontWeight: 'bold', color: '#ef4444'}}>Expired</Text> : ''}
          </>
        ) : ''}
        {active ? (
          <>
            <FontAwesome6 name="plug-circle-check" size={16} color="#16a34a" />
            {size === 'large' ? <Text style={{ fontWeight: 'bold', color: '#16a34a'}}>Connected</Text> : ''}
          </>
        ) : ''}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    paddingHorizontal: 8, 
    paddingVertical: 8,
  },

  textFullname: {
    marginBottom: -4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },

  textUsername: {
    fontSize: 14,
    color: 'gray',
  }
})

export default ConnectionItem
