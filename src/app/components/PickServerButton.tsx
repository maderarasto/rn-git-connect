import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native'
import React from 'react'

type PickServerButtonParams = {
    icon: React.JSX.Element,
    text: string,
    onPress?: (event: GestureResponderEvent) => void
}

const PickServerButton = ({ icon, text, onPress }: PickServerButtonParams) => {
  return (
    <TouchableOpacity style={{ gap: 4, paddingHorizontal: 16, paddingVertical: 8 }} onPress={onPress}>
      {icon}
      <Text style={{ textAlign: 'center'}}>{text}</Text>
    </TouchableOpacity>
  )
}

export default PickServerButton