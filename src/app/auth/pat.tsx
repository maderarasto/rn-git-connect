import { View, Text, ToastAndroid, Platform, TouchableWithoutFeedback, StyleSheet, Keyboard, ActivityIndicator, ViewStyle } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Redirect, useLocalSearchParams, useNavigation } from 'expo-router'
import AuthHeader from '@src/components/headers/AuthHeader';
import { AccountType, User } from '@src/api/types';
import { unslug } from '@src/utils/strings';
import PastableTextarea from '@src/components/inputs/PastableTextarea';
import TextButton from '@src/components/buttons/TextButton';
import PrimaryButton from '@src/components/buttons/PrimaryButton';
import colors from '@src/utils/colors';
import useAuthQuery from '@src/hooks/query/useAuthQuery';
import { useAuth } from '@src/providers/AuthProvider';

const UNAUTHORIZED_MESSAGES = [
  'Bad credentials',
  '401 Unauthorized',
];

const AuthPATScreen = () => {
  const {type} = useLocalSearchParams<{ type: string }>();
  
  const navigation = useNavigation();
  const authContext = useAuth();

  if (!authContext) {
    throw new Error('Missing necessary context for authenticating user!');
  }
  
  if (!type) {
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(
        'Redirecting back because there wasn\'t chosen account type.', 
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }

    return <Redirect href="/" />
  }

  const [token, setToken] = useState('');
  const [queryEnabled, setQueryEnabled] = useState(false);
  const accountType: AccountType = unslug(type) as AccountType;

  const {
    data: user,
    error,
    isFetching,
    invalidateQuery,
  } = useAuthQuery(token, queryEnabled);

  useEffect(() => {
    if (user) {
      singIn(user);
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      setQueryEnabled(false);
    }
  }, [error]);

  const singIn = async (user: User) => {
    await authContext.saveAccount(user, token);
    authContext.setUser(user);
    await invalidateQuery();

    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(
        `Signed in as ${user.username}`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }

    const navigationRoutes = [
      { name: '(main)/(drawer)'} as never,
    ];

    // TODO: navigate to redirect URL

    navigation.reset({
      index: 0,
      routes: navigationRoutes,
    });
  }

  const resolveError = () => {
    if (!error) {
      return '';
    }

    if (UNAUTHORIZED_MESSAGES.includes(error.message)) {
      return 'Your token is invalid!';
    }

    return error.message;
  }

  const resolveLoadingStyle = () => {
    const loadingStyle: ViewStyle = {
      ...styles.loading,
      display: isFetching ? 'flex' : 'none',
    };

    return loadingStyle;
  }

  const onAuthorizePress = async () => {
    Keyboard.dismiss();
    await invalidateQuery();
    
    setQueryEnabled(true);
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <AuthHeader type={accountType} />
        <View style={{ width: '70%' }}>
          <View style={{ gap: 8, marginBottom: 32, }}>
            <PastableTextarea 
              label="Personal Access Token" 
              placeholder="Enter personal access token..."
              value={token}
              errorText={resolveError()}
              lines={4}
              onChangeText={(text) => setToken(text)} 
              onClear={() => setToken('')}/>
            <TextButton 
              // style={styles.infoButton} 
              text="How to get personal access token?" 
              // onPress={onInfoButtonPress} 
              underlined />
          </View>
          <PrimaryButton 
            text="Authorize" 
            style={{ backgroundColor: colors.primary}} 
            onPress={onAuthorizePress} />
        </View>
        <View style={resolveLoadingStyle()}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ fontSize: 14 }}>Authorizing...</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  loading: { 
    position: 'absolute', 
    bottom: 100, 
    gap: 12 
  }
})

export default AuthPATScreen