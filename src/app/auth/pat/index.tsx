import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {AntDesign} from '@expo/vector-icons';

import AuthHeader from '@src/components/AuthHeader';
import { convertFromSlug, saveAccount } from '@src/utils';
import { AccountType } from '@src/types';
import LabeledTextInput from '@src/components/LabeledTextInput';
import TextButton from '@src/components/buttons/TextButton';
import SlidedModal, { SlidedModalMethods } from '@src/components/modals/SlidedModal';
import PrimaryButton from '@src/components/buttons/PrimaryButton';
import AuthPATGitHubTemplate from '@src/templates/help/AuthPATGitHubTemplate';
import AuthPATGitLabTemplate from '@src/templates/help/AuthPATGitLabTemplate';
import useAuthQuery from '@src/hooks/useAuthQuery';
import { AuthUser } from '@src/api/types';
import { AuthUserContext, AuthUserContextType } from '@src/context/AuthUserContext';

const UNAUTHORIZED_MESSAGES = [
  'Bad credentials',
  '401 Unauthorized',
];

const Page = () => {
  const authUserContext = useContext(AuthUserContext);

  if (!authUserContext) {
    throw new Error('AuthUserContext must be used withing AUthUserProvider!');
  }

  const router = useRouter();
  const {type} = useLocalSearchParams();
  const accountType: AccountType 
    = convertFromSlug(type as string) as AccountType;

  if (!accountType || accountType === 'Git') {
    router.replace('/');
    return;
  }

  const modalRef = useRef<SlidedModalMethods>(null);
  const {
    data: authUser, 
    isLoading, 
    error,
    authToken,
    setAuthToken, 
    refetch
  } = useAuthQuery(accountType);

  useEffect(() => {
    if (!authUser) return;

    signUserIn(authUserContext, authUser);
    router.replace('dashboard');
  }, [authUser]);

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

    if (UNAUTHORIZED_MESSAGES.includes(error.message)) {
      return 'Your token is invalid!';
    }

    return error.message;
  }

  function resolveUsername() {
    if (!authUser) {
      return '';
    }

    const user: AuthUser = {
      ...authUser,
    };

    user.type = accountType === 'GitHub' ? 'GitHub' : 'GitLab';
    return user.type === 'GitHub' ? user.login : user.username;
  }

  function signUserIn(context: AuthUserContextType, user: AuthUser) {
    saveAccount(accountType, resolveUsername(), authToken);
    context.setUser(user);

    ToastAndroid.show('Authenticated', ToastAndroid.SHORT);
  }

  function onTokenChangeText(token: string) {
    setAuthToken(token);
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
    refetch();
  }

  function onGoButtonPressed() {
    modalRef.current?.hide();
    router.navigate(resolveLinkUrl())
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
            value={authToken} 
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