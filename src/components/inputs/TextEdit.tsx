import { StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native'
import React, {forwardRef, ReactNode, useImperativeHandle, useRef, useState} from 'react'

export type TextEditMethods = {
  clearText: () => void
  getText: () => string
  setText: (text: string) => void
}

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

const TextEdit = forwardRef<TextEditMethods, TextEditProps>(({
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
} : TextEditProps, ref) => {
  const [focused, setFocused] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    clearText: function () {
      textInputRef.current?.clear();

      if (inputProps.onChangeText) {
        inputProps.onChangeText('');
      }
    },

    getText: function () {
      if (!textInputRef.current) {
        return '';
      }

      return textInputRef.current.props.value ?? '';
    },

    setText: function (text: string) {
      textInputRef.current?.setNativeProps({ text });
    }
  }));

  function resolveContainerStyle() {
    return {
      ...styles.container,
      ...containerStyle
    };
  }

  function resolveLabelStyle() {
    return {
      ...styles.labelText,
      ...labelStyle,
    };
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
    return {
      ...styles.textInput,
      ...inputStyle as TextStyle,
    };
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
          ref={textInputRef}
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
});

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
    backgroundColor: '#f6f6f6'
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
