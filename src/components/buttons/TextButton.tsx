import { View, Text, Pressable, PressableProps, StyleProp, ViewStyle, TextStyle } from 'react-native'
import React from 'react'

export type TextButtonProps = PressableProps & {
    text: string,
    underlined?: boolean,
}

const TextButton = ({
    text,
    underlined = false,
    ...pressableProps
}: TextButtonProps) => {
  function resolveTextStyle() {
    let textStyle: StyleProp<TextStyle> = {};

    textStyle.textDecorationLine = underlined ? 'underline' : 'none';

    return textStyle;
  }

  return (
    <Pressable {...pressableProps}>
      <Text style={resolveTextStyle()}>{text}</Text>
    </Pressable>
  )
}

export default TextButton