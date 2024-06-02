import { View, Text, TouchableOpacity, GestureResponderEvent, NativeSyntheticEvent, StyleProp, ViewStyle } from 'react-native'
import React from 'react'

type PickServerButtonParams = {
    icon: React.JSX.Element
    text: string
    disabled?: boolean
    onPress?: (event: GestureResponderEvent) => void
}

const PickServerButton = ({ icon, text, disabled, onPress }: PickServerButtonParams) => {
  function resolveButtonStyle() {
    let buttonStyle: StyleProp<ViewStyle> = {
      gap: 4,
      paddingHorizontal: 16,
      paddingVertical: 8
    };

    buttonStyle.opacity = disabled ? 0.6 : 1;

    return buttonStyle;
  }

  return (
    <TouchableOpacity style={resolveButtonStyle()} disabled={disabled} onPress={onPress}>
      {icon}
      <Text style={{ textAlign: 'center'}}>{text}</Text>
    </TouchableOpacity>
  )
}

export default PickServerButton