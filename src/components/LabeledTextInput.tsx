import { View, Text, TextInput, StyleSheet, NativeSyntheticEvent, TextInputFocusEventData, TextInputProps, ViewStyle } from 'react-native'
import React, { ReactNode, useState } from 'react'
import { PropViewStyle } from '@src/types'

type LabeledTextInputParams = TextInputProps & {
  label?: string
  icon?: ReactNode,
  iconSide?: 'left' | 'right',
  errorText?: string
  accentColor?: string
  style?: PropViewStyle
  highlight?: boolean
}

const DEFAULT_BORDER_COLOR = '#a3a3a3';

const LabeledTextInput = ({
  label,
  icon,
  iconSide = 'left',
  errorText = '',
  accentColor = '#2563eb',
  style = {},
  highlight = true,
  ...inputProps
}: LabeledTextInputParams) => {
  const [focused, setFocused] = useState(false);

  function resolveContainerStyle() {
    let containerStyle: PropViewStyle = {
      ...styles.container,
      ...(style as object)
    };

    return containerStyle;
  }

  function resolveInputWrapperStyle() {
    let style: PropViewStyle = {
      ...styles.inputWrapper
    };

    if (highlight) {
      style.borderColor = focused ? accentColor : DEFAULT_BORDER_COLOR;
    }

    return style;
  }

  function resolveInputStyle() {
    let style: ViewStyle = {
      ...styles.input
    };

    style.paddingLeft = icon && iconSide === 'left' ? 0 : style.paddingLeft;

    return style;
  }

  function resolveErrorText() {
    return `Error: ${errorText}`;
  }

  function onInputFocus() {
    setFocused(true);
  }

  function onInputBlur() {
    console.log('sadas');
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
      flex: 1,
    },

    label: {
      fontSize: 16,
      fontFamily: 'Inter_600SemiBold'
    },

    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: DEFAULT_BORDER_COLOR,
      borderRadius: 5,
      backgroundColor: '#eee',
    },

    input: {
      flex: 1,
      height: 40,
      paddingLeft: 8,
    },

    errorText: {
      fontSize: 14,
      color: '#dc2626'
    }
})

export default LabeledTextInput