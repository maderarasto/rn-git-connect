import { View, Text, TextInput, StyleSheet, TextStyle, ViewStyle } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import * as Clipboard from 'expo-clipboard';

import TextButton from '../buttons/TextButton'

export type PastableTextareaProps = {
  label?: string
  placeholder?: string
  value?: string
  errorText?: string
  lines?: number
  style?: ViewStyle
  allowActions?: boolean
  readOnly?: boolean
  onChangeText?: (value: string) => void
  onClear?: () => void
}

const PastableTextarea = ({
  label = '',
  placeholder = '',
  value = '',
  errorText = '',
  lines = 5,
  style = {},
  allowActions = true,
  readOnly = false,
  onChangeText,
  onClear,
}: PastableTextareaProps) => {
  const [text, setText] = useState(value);
  const [focused, setFocused] = useState(false);
  const afterMountRef = useRef(false);

  useEffect(() => {
    setText(value);
  }, [value])

  useEffect(() => {
    if (!afterMountRef.current) {
      afterMountRef.current = true;
      return;
    }

    if (!onChangeText) {
      return;
    }

    onChangeText(text);
  }, [text]);

  function resolveContainerStyle() {
    let containerStyle: ViewStyle = {
      ...styles.container,
      ...style,
    };

    return containerStyle;
  }

  function resolveLabelStyle() {
    let labelStyle: TextStyle = {
      ...styles.label,
    };

    if (!label) {
      labelStyle.display = 'none';
    }

    return labelStyle;
  }

  function resolveTextFieldStyle() {
    let textFieldStyle: TextStyle = {
      ...styles.textarea,
    };

    if (focused) {
      textFieldStyle.borderColor = '#2563eb';
    }

    return textFieldStyle;
  }

  function onChangeTextContent(text: string) {
    setText(text);
  }

  function onTextFieldFocus() {
    setFocused(true);
  }

  function onTextFieldBlur() {
    setFocused(false);
  }

  function onClearPress() {
    setText('');

    if (!onClear) {
      return;
    }

    onClear();
  }

  async function onPastePress() {
    setText(await Clipboard.getStringAsync());
  }

  return (
    <View style={resolveContainerStyle()}>
      <Text style={resolveLabelStyle()}>{label}</Text>
      <TextInput 
        style={resolveTextFieldStyle()} 
        textAlignVertical="top" 
        placeholder={placeholder}
        value={text}
        multiline={true} 
        numberOfLines={lines}
        readOnly={readOnly}
        onChangeText={onChangeTextContent}
        onFocus={onTextFieldFocus}
        onBlur={onTextFieldBlur} />
      { errorText ? (
        <Text style={styles.errorText}>Error: {errorText}</Text>
      ) : '' }
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 16 }}>
        {allowActions ? (
          <>
            {text.length > 0 ? (
              <TextButton text="Clear" textStyle={styles.clearButton} onPress={onClearPress} />
            ) : ''}
            <TextButton text="Paste"  textStyle={styles.saveButton} onPress={onPastePress} />
          </>
        ) : ''}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    
  },

  label: {
    marginBottom: 8,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold'
  },

  textarea: {
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'gray',
    fontSize: 16
  },

  errorText: {
    color: '#ef4444',
  },

  clearButton: {
    fontSize: 16, 
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
    color: 'gray'
  },

  saveButton: {
    fontSize: 16, 
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
    color: '#2563eb'
  }
})

export default PastableTextarea