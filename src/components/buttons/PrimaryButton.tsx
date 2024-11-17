import { View, Text, StyleSheet, TouchableOpacity, TextStyle, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'

export type PrimaryButtonProps = {
  text: string
  icon?: ReactNode
  style?: ViewStyle
  textStyle?: TextStyle
  onPress?: () => void
}

const PrimaryButton = ({
  text,
  icon,
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
      { icon ? icon : ''}
      <Text style={resolveTextStyle()}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#000'
  },

  buttonText: {
    fontSize: 14,
    color: '#fff'
  }
});

export default PrimaryButton