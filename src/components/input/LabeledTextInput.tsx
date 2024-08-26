import { View, Text, TextInput, TextInputProps, StyleSheet, ViewStyle } from 'react-native'
import React, { ReactNode, useState } from 'react'

type LabeledTextInputProps = TextInputProps & {
  label?: string
  icon?: ReactNode,
  iconSide?: 'left' | 'right'
  errorText?: string
  accentColor?: string
  style?: ViewStyle
  highlight?: boolean
}

const LabeledTextInput = ({
  label,
  icon,
  iconSide = 'left',
  errorText = '',
  accentColor = '#2563eb',
  style = {},
  highlight = true,
  ...inputProps
}: LabeledTextInputProps) => {
  const [focused, setFocused] = useState(false);
  
  function resolveContainerStyle() {
    let containerStyle: ViewStyle = {
      ...styles.container,
      ...(style as object)
    };

    return containerStyle;
  }

  function resolveInputWrapperStyle() {
    let wrapperStyle: ViewStyle = {
      ...styles.inputWrapper
    };

    if (highlight) {
      wrapperStyle.borderColor = focused ? accentColor : '#a3a3a3';
    }

    return wrapperStyle;
  }

  function resolveInputStyle() {
    let inputStyle: ViewStyle = {
      ...styles.input
    };

    inputStyle.paddingLeft = icon && iconSide === 'left' ? 0 : style.paddingLeft;

    return inputStyle;
  }

  function resolveErrorText() {
    return `Error: ${errorText}`;
  }

  function onInputFocus() {
    setFocused(true);
  }

  function onInputBlur() {
    setFocused(false);
  }

  return (
    <View style={resolveContainerStyle()}>
      {label ? (
        <Text style={styles.label}>{label}</Text>
      ) : ''}
      <View style={resolveInputWrapperStyle()}>
        {icon && iconSide === 'left' ? icon : ''}
        <TextInput style={resolveInputStyle()} onFocus={onInputFocus} onBlur={onInputBlur} {...inputProps} />
        {icon && iconSide === 'right' ? icon : ''}
      </View>
      {errorText ? <Text style={styles.errorText}>{resolveErrorText()}</Text> : ''}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },

  label: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#a3a3a3',
    borderRadius: 5,
    backgroundColor: '#eee',
  },

  input: {
    flex: 1,
    paddingLeft: 8,
  },

  errorText: {
    fontSize: 14,
    color: '#dc2626',
  }
})

export default LabeledTextInput