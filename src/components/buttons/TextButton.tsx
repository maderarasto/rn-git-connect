import { View, Text, Pressable, PressableProps, StyleProp, ViewStyle, TextStyle, TouchableOpacityProps, TouchableOpacity } from 'react-native'
import React from 'react'

export type TextButtonProps = TouchableOpacityProps & {
    text: string
    textStyle?: TextStyle
    underlined?: boolean
}

const TextButton = ({
    text,
    textStyle = {},
    underlined = false,
    ...touchableProps
}: TextButtonProps) => {
  function resolveTextStyle() {
    let style: TextStyle = {
      ...textStyle,
    };

    style.textDecorationLine = underlined ? 'underline' : 'none';

    return style;
  }

  return (
    <TouchableOpacity {...touchableProps}>
      <Text style={resolveTextStyle()}>{text}</Text>
    </TouchableOpacity>
  )
}

export default TextButton