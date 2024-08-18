import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import {AntDesign} from '@expo/vector-icons';

import AuthHeader from '@src/components/AuthHeader';
import { convertFromSlug, saveAccount } from '@src/utils';
import { AccountType, User } from '@src/types';
import TextButton from '@src/components/buttons/TextButton';
import Dialog, { DialogMethods } from '@src/components/dialogs/Dialog';
import PrimaryButton from '@src/components/buttons/PrimaryButton';
import AuthPATGitHubTemplate from '@src/templates/help/AuthPATGitHubTemplate';
import AuthPATGitLabTemplate from '@src/templates/help/AuthPATGitLabTemplate';
import useAuthQuery from '@src/hooks/useAuthQuery';
import { AuthUserContext, AuthUserContextType } from '@src/context/AuthUserContext';
import LabeledTextInput from '@src/components/LabeledTextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UNAUTHORIZED_MESSAGES = [
  'Bad credentials',
  '401 Unauthorized',
];

const Page = () => {
  const [queryEnabled, setQueryEnabled] = useState(false);
  const authUserContext = useContext(AuthUserContext);

  if (!authUserContext) {
    throw new Error('AuthUserContext must be used withing AUthUserProvider!');
  }

  const router = useRouter();
  const navigation = useNavigation();
  const {type, redirect} = useLocalSearchParams();
  const accountType: AccountType 
    = convertFromSlug(type as string) as AccountType;
  
  if (!accountType) {
    router.replace('/');
    return;
  }
  
  const modalRef = useRef<DialogMethods>(null);
  const {
    data: authUser, 
    isLoading, 
    error,
    authToken,
    setAuthToken, 
    invalidateQuery,
  } = useAuthQuery(accountType, '', queryEnabled);

  useEffect(() => {
    if (!authUser) return;
    
    signUserIn(authUserContext, authUser);
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

  async function signUserIn(context: AuthUserContextType, user: User) {
    await saveAccount(user, authToken);
    await invalidateQuery();
    context.setUser(user);
    
    ToastAndroid.show('Authenticated', ToastAndroid.SHORT);
    
    const navigationRoutes = [
      { name: 'dashboard'} as never,
    ];

    if (redirect) {
      navigationRoutes.push({
        name: redirect as string
      } as never);
    }
    
    navigation.reset({
      index: redirect ? 1 : 0,
      routes: navigationRoutes
    });
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
    setQueryEnabled(true);
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
              label="Personal Access Token"
              value={authToken} 
              errorText={resolveError()}
              style={{ marginBottom: 8, }}
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
        <Dialog ref={modalRef} title="Personal Access Tokens">
          <>
            {resolveModalTemplate()}
            <PrimaryButton style={{ alignSelf: "center" }} onPress={onGoButtonPressed}>
              <Text style={{ color: "white" }}>Go to {accountType}</Text>
            </PrimaryButton>
          </>
        </Dialog>
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
    // gap: 16,
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