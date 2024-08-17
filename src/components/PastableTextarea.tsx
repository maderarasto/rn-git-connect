import { View, Text, TextInput, StyleSheet, TextStyle, ViewStyle } from 'react-native'
import React, { useState } from 'react'
import * as Clipboard from 'expo-clipboard';

import PrimaryButton from './buttons/PrimaryButton'
import TextButton from './buttons/TextButton'

export type PastableTextareaProps = {
  label?: string
  placeholder?: string
  value?: string
  lines?: number
  style?: ViewStyle
  onChangeText?: (value: string) => void
}

const PastableTextarea = ({
  label = '',
  placeholder = '',
  value = '',
  lines = 5,
  style = {},
  onChangeText
}: PastableTextareaProps) => {
  const [text, setText] = useState(value);
  const [focused, setFocused] = useState(false);

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

    if (!onChangeText) {
      return text;
    }

    onChangeText(text);
  }

  function onTextFieldFocus() {
    setFocused(true);
  }

  function onTextFieldBlur() {
    setFocused(false);
  }

  function onClearPress() {
    setText('');
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
        onChangeText={onChangeTextContent}
        onFocus={onTextFieldFocus}
        onBlur={onTextFieldBlur} />
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 16 }}>
        {text.length > 0 ? (
          <TextButton text="Clear" textStyle={styles.clearButton} onPress={onClearPress} />
        ) : ''}
        <TextButton text="Paste"  textStyle={styles.saveButton} onPress={onPastePress} />
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
    fontWeight: 'bold',
  },

  textarea: {
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'gray',
    fontSize: 16
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