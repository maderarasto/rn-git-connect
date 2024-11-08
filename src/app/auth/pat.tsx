import { View, Text, ToastAndroid, Platform, TouchableWithoutFeedback, StyleSheet, Keyboard, ScrollView } from 'react-native'
import React from 'react'
import { Redirect, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthHeader from '@src/components/AuthHeader';
import { AccountType } from '@src/api/types';
import { unslug } from '@src/utils/strings';
import PastableTextarea from '@src/components/inputs/PastableTextarea';
import TextButton from '@src/components/buttons/TextButton';
import PrimaryButton from '@src/components/buttons/PrimaryButton';
import colors from '@src/utils/colors';

const AuthPATScreen = () => {
  const {type} = useLocalSearchParams<{ type: string }>();
  
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

  const accountType: AccountType = unslug(type) as AccountType;

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <AuthHeader type={accountType} />
        <View style={{ width: '70%' }}>
          <View style={{ gap: 8, marginBottom: 32, }}>
            <PastableTextarea 
              label="Personal Access Token" 
              placeholder="Enter personal access token..."
              // value={accessToken}
              // errorText={resolveError()}
              lines={4}
              // onChangeText={onAccessTokenTextChanged}
              // onClear={onAccessTokenClear} 
            />
            <TextButton 
              // style={styles.infoButton} 
              text="How to get personal access token?" 
              // onPress={onInfoButtonPress} 
              underlined />
          </View>
          <PrimaryButton text="Authorize" style={{ backgroundColor: colors.primary}} onPress={() => {}} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default AuthPATScreen