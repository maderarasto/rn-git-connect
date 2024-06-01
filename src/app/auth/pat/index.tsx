import { View, Text, StyleSheet, Pressable, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {AntDesign} from '@expo/vector-icons';

import AuthHeader from '@src/components/AuthHeader';
import { capitalize, convertFromSlug } from '@src/utils';
import { AccountType } from '@src/types';
import LabeledTextInput from '@src/components/LabeledTextInput';
import TextButton from '@src/components/TextButton';
import SlidedModal from '@src/components/SlidedModal';

const Page = () => {
  const {type} = useLocalSearchParams();
  const router = useRouter();
  
  const accountType: AccountType = convertFromSlug(type as string) as AccountType;

  function resolveHeaderTitle() {
    return `Sign In to ${accountType}`
  }
  
  function resolveHeaderIcon() {
    return <AntDesign name={accountType === 'GitHub' ? 'github' : 'gitlab'} size={92} color="black" />;
  }

  function onInfoButtonPress() {
    Keyboard.dismiss();
  }

  function onSubmitButtonPress() {
    Keyboard.dismiss();
  }
  
  if (!accountType || accountType === 'Git') {
    router.replace('/');
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <AuthHeader title={resolveHeaderTitle()} icon={resolveHeaderIcon()} />
        <View style={styles.form}>
          <LabeledTextInput style={styles.inputPAT} label="Personal Access Token" />
          <TextButton 
            style={styles.infoButton} 
            text="How to get personal access token?" 
            onPress={onInfoButtonPress} 
            underlined />
          <TouchableOpacity style={styles.submitButton} onPress={onSubmitButtonPress}>
            <Text style={{ color: 'white' }}>Authorize</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  form: {
    gap: 16,
    width: '70%',
  },

  inputPAT: {
  },

  infoButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },

  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 5,
    backgroundColor: '#2563eb',
  }
})

export default Page