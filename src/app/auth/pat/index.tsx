import { View, Text, StyleSheet, Pressable, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard, BackHandler, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {AntDesign} from '@expo/vector-icons';

import AuthHeader from '@src/components/AuthHeader';
import { convertFromSlug } from '@src/utils';
import { AccountType } from '@src/types';
import LabeledTextInput from '@src/components/LabeledTextInput';
import TextButton from '@src/components/buttons/TextButton';
import SlidedModal, { SlidedModalMethods } from '@src/components/modals/SlidedModal';
import PrimaryButton from '@src/components/buttons/PrimaryButton';
import AuthPATGitHubTemplate from '@src/templates/help/AuthPATGitHubTemplate';
import AuthPATGitLabTemplate from '@src/templates/help/AuthPATGitLabTemplate';
import { useQuery } from '@tanstack/react-query';
import GitHubAPI from '@src/api/github';
import {  AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

type AuthAxiosError = AxiosError & {
  response: {
    data: {
      documentation_url: string
      message: string
    }
  }
}

const Page = () => {
  const [token, setToken] = useState('');

  const {type} = useLocalSearchParams();
  const accountType: AccountType = convertFromSlug(type as string) as AccountType;
  
  const router = useRouter();
  const modalRef = useRef<SlidedModalMethods>(null);
  const {data, isLoading, error, refetch} = useQuery<unknown, AuthAxiosError>({
    queryKey: ['authUser'],
    queryFn: () => GitHubAPI.auth.user(),
    enabled: false
  })

  console.log(data);

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

  function resolveError() {
    if (!error) {
      return '';
    }

    if (error.response?.data.message === 'Bad credentials') {
      return 'Your token is invalid!';
    }

    return error.response?.data.message ?? error.message;
  }

  function onTokenChangeText(token: string) {
    setToken(token);
  }

  function onInfoButtonPress() {
    Keyboard.dismiss();

    if (!modalRef.current) {
      return;
    }

    modalRef.current.show();
  }

  async function onSubmitButtonPress() {
    Keyboard.dismiss();
    await SecureStore.setItemAsync('pat', token);
    refetch();
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
          <LabeledTextInput 
            errorText={resolveError()}
            label="Personal Access Token"
            style={styles.inputPAT}
            value={token} 
            onChangeText={onTokenChangeText} />
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
        {isLoading ? (
          <ActivityIndicator size={42} color="#2563eb" style={styles.loadingIndicator} />
        ) : ''}
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
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

  loadingIndicator: {
    position: 'absolute',
    bottom: 50,
  }
})

export default Page