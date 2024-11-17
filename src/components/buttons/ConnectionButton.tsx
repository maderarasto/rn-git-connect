import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import {AntDesign} from '@expo/vector-icons';

export type ConnectionButtonProps = {
  onPress?: () => void
}

const ConnectionButton = ({
  onPress
}: ConnectionButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <AntDesign name="pluscircleo" size={24} color="#6b7280" style={{ marginHorizontal: 4 }} />
      <Text style={styles.buttonText}>Add New Connection</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    padding: 8, 
  },

  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280'
  },
})

export default ConnectionButton
