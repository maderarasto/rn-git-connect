import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, ActivityIndicator, ToastAndroid, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import {AntDesign} from '@expo/vector-icons';

import AuthHeader from '@src/components/headers/AuthHeader';
import { convertFromSlug, saveAccount } from '@src/utils';
import { AccountType, User } from '@src/types';
import TextButton from '@src/components/buttons/TextButton';
import Dialog, { DialogMethods } from '@src/components/dialogs/Dialog';
import PrimaryButton from '@src/components/buttons/PrimaryButton';
import AuthPATGitHubTemplate from '@src/templates/help/AuthPATGitHubTemplate';
import AuthPATGitLabTemplate from '@src/templates/help/AuthPATGitLabTemplate';
import useAuthQuery from '@src/hooks/useAuthQuery';
import { AuthUserContext, AuthUserContextType } from '@src/context/AuthUserContext';
import PastableTextarea from '@src/components/input/PastableTextarea';
import BaseHeader from '@src/components/headers/BaseHeader';

const UNAUTHORIZED_MESSAGES = [
  'Bad credentials',
  '401 Unauthorized',
];

const Page = () => {
  const [queryEnabled, setQueryEnabled] = useState(false);
  const [accessToken, setAccessToken] = useState('');
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
    if (!authToken) {
      return;
    }
    
    setQueryEnabled(true);
  }, [authToken]);

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

  function onAccessTokenTextChanged(text: string) {
    setAccessToken(text);
  }

  function onAccessTokenClear() {
    setAuthToken('');
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
    await invalidateQuery();
    setAuthToken(accessToken);
  }

  function onGoButtonPressed() {
    modalRef.current?.hide();
    router.navigate(resolveLinkUrl())
  }

  function onBackPress() {
    router.back();
  }

  return (
    <View style={{ flex: 1, }}>
      <BaseHeader
        options={{
          headerStyle: { backgroundColor: 'transparent' },
          headerLeft: () => (
            <TouchableOpacity onPress={onBackPress}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <AuthHeader title={resolveHeaderTitle()} icon={resolveHeaderIcon()} />
        <View style={styles.form}>
          <View style={{ gap: 8, marginBottom: 32, }}>
            <PastableTextarea 
              label="Personal Access Token" 
              placeholder="Enter personal access token..."
              value={accessToken}
              errorText={resolveError()}
              lines={4}
              onChangeText={onAccessTokenTextChanged}
              onClear={onAccessTokenClear} />
            <TextButton 
              style={styles.infoButton} 
              text="How to get personal access token?" 
              onPress={onInfoButtonPress} 
              underlined />
          </View>
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
    </View>
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