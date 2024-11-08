import { View, Text, StyleSheet, TouchableOpacity, TextStyle, ViewStyle } from 'react-native'
import React from 'react'

export type PrimaryButtonProps = {
  text: string
  style?: ViewStyle
  textStyle?: TextStyle
  onPress?: () => void
}

const PrimaryButton = ({
  text,
  style = {},
  textStyle = {},
  onPress,
}: PrimaryButtonProps) => {
  const resolveStyle = () => {
    let resolvedStyle = {
      ...styles.button,
      ...style,
    };

    return resolvedStyle;
  }

  const resolveTextStyle = () => {
    let resolvedStyle = {
      ...styles.buttonText,
      ...textStyle,
    };

    return resolvedStyle;
  }

  return (
    <TouchableOpacity style={resolveStyle()} onPress={onPress}>
      <Text style={resolveTextStyle()}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#000'
  },

  buttonText: {
    color: '#fff'
  }
});

export default PrimaryButton