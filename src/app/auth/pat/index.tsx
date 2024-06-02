import { View, Text, StyleSheet, Pressable, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard, BackHandler } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {AntDesign} from '@expo/vector-icons';

import AuthHeader from '@src/components/AuthHeader';
import { capitalize, convertFromSlug } from '@src/utils';
import { AccountType } from '@src/types';
import LabeledTextInput from '@src/components/LabeledTextInput';
import TextButton from '@src/components/buttons/TextButton';
import SlidedModal, { SlidedModalMethods } from '@src/components/modals/SlidedModal';
import BulletList from '@src/components/BulletList';
import PrimaryButton from '@src/components/buttons/PrimaryButton';
import AuthPATGitHubTemplate from '@src/templates/help/AuthPATGitHubTemplate';
import AuthPATGitLabTemplate from '@src/templates/help/AuthPATGitLabTemplate';

const Page = () => {
  const {type} = useLocalSearchParams();
  const modalRef = useRef<SlidedModalMethods>(null);
  const router = useRouter();
  
  const accountType: AccountType = convertFromSlug(type as string) as AccountType;

  function resolveHeaderTitle() {
    return `Sign In to ${accountType}`
  }
  
  function resolveHeaderIcon() {
    return <AntDesign 
      name={accountType === 'GitHub' ? 'github' : 'gitlab'} 
      size={92} 
      color={accountType === 'GitHub' ? '#1e293b' : '#ea580c'} />;
  }

  function resolveModalTemplate() {
    return accountType === 'GitHub' 
      ? <AuthPATGitHubTemplate />
      : <AuthPATGitLabTemplate />;
  }

  function resolveLinkUrl() {
    return accountType === 'GitHub' ? 'https://github.com/settings/profile' : 'https://gitlab.com/-/profile/preferences';
  }

  function onInfoButtonPress() {
    Keyboard.dismiss();

    if (!modalRef.current) {
      return;
    }

    modalRef.current.show();
  }

  function onSubmitButtonPress() {
    Keyboard.dismiss();
  }

  function onGoButtonPressed() {
    modalRef.current?.hide();
    router.navigate(resolveLinkUrl())
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
          <PrimaryButton onPress={onSubmitButtonPress}>
            <Text style={{ color: 'white' }}>Authorize</Text>
          </PrimaryButton>
        </View>
        <SlidedModal ref={modalRef} title="Personal Access Tokens" contentContainerStyle={{ paddingBottom: 16 }}>
          <>
            {resolveModalTemplate()}
            <PrimaryButton style={{ alignSelf: "center" }} onPress={onGoButtonPressed}>
              <Text style={{ color: "white" }}>Go to {accountType}</Text>
            </PrimaryButton>
          </>
        </SlidedModal>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
})

export default Page