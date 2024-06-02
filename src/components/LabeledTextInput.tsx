import { View, Text, TextInput, StyleSheet, NativeSyntheticEvent, TextInputFocusEventData, TextInputProps } from 'react-native'
import React, { useState } from 'react'
import { PropViewStyle } from '@src/types'

type LabeledTextInputParams = TextInputProps & {
  label?: string
  accentColor?: string
  style?: PropViewStyle
}

const DEFAULT_BORDER_COLOR = '#a3a3a3';

const LabeledTextInput = ({
  label,
  accentColor = '#2563eb',
  style = {},
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

  function resolveInputStyle() {
    let style: PropViewStyle = {
      ...styles.input
    };

    style.borderColor = focused ? accentColor : DEFAULT_BORDER_COLOR;

    return style;
  }

  function onInputFocus() {
    setFocused(true);
  }

  function onInputBlur() {
    console.log('blur')
    setFocused(false);
  }

  return (
    <View style={resolveContainerStyle()}>
      {label ? (
        <Text style={styles.label}>{label}</Text>
      ) : ''}
      <TextInput style={resolveInputStyle()} onFocus={onInputFocus} onBlur={onInputBlur} {...inputProps} />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {

    },

    label: {
      marginBottom: 5,
      fontSize: 16,
      fontFamily: 'Inter_600SemiBold'
    },

    input: {
        height: 40,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: DEFAULT_BORDER_COLOR,
        borderRadius: 5,
    }
})

export default LabeledTextInput