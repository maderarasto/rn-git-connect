import { StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native'
import React, { ReactNode, useState } from 'react'

export type TextEditProps = TextInputProps & {
  label?: string
  icon?: ReactNode
  iconSide?: 'left' | 'right'
  highlight?: boolean
  accentColor?: string
  errorText?: string
  containerStyle?: ViewStyle
  labelStyle?: TextStyle
  inputWrapperStyle?: ViewStyle
}

const TextEdit = ({
  label,
  icon,
  iconSide = 'left',
  highlight = true,
  accentColor = '#2563eb',
  errorText,
  containerStyle = {},
  labelStyle = {},
  inputWrapperStyle = {},
  style: inputStyle = {},
  ...inputProps
} : TextEditProps) => {
  const [focused, setFocused] = useState(false);

  function resolveContainerStyle() {
    const resolvedStyle = {
      ...styles.container,
      ...containerStyle
    };
    
    return resolvedStyle;
  }

  function resolveLabelStyle() {
    const resolvedStyle = {
      ...styles.labelText,
      ...labelStyle,
    }

    return resolvedStyle;
  }

  function resolveInputWrapperStyle() {
    let resolvedStyle: ViewStyle = {
      ...styles.inputWrapper,
      ...inputWrapperStyle,
    };

    if (highlight) {
      resolvedStyle.borderColor = focused ? accentColor : '#a3a3a3';
    }

    return resolvedStyle;
  }

  function resolveInputStyle() {
    const resolvedStyle = {
      ...styles.textInput,
      ...inputStyle as TextStyle,
    };

    return resolvedStyle;
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
        <Text style={resolveLabelStyle()}>{label}</Text>
      ) : ''}
      <View style={resolveInputWrapperStyle()}>
        {icon && iconSide === 'left' ? icon : ''}
        <TextInput 
          style={resolveInputStyle()} 
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          {...inputProps} />
        {icon && iconSide === 'right' ? icon : ''}
      </View>
      {errorText ? (
        <Text style={styles.errorText}>{resolveErrorText()}</Text>
      ) : ''}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 5
  },

  labelText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#a3a3a3',
    borderRadius: 6,
    backgroundColor: '#eee'
  },

  textInput: {
    flex: 1,
    paddingLeft: 2,
    fontSize: 16,
  },

  errorText: {
    fontSize: 14,
    color: '#dc2626',
  }
});

export default TextEdit;
