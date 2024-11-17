import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { AccountType } from '@src/api/types'
import {AntDesign} from '@expo/vector-icons';
import BaseHeader from './BaseHeader';
import { useRouter } from 'expo-router';

export type AuthHeaderProps = {
  type: AccountType
};

const AuthHeader = ({ type }: AuthHeaderProps) => {
  const router = useRouter();

  const resolveTypeIcon = () => {
    let iconName = '';
    let iconColor = '';

    if (type === 'Github') {
      iconName = 'github';
      iconColor = '#1e293b';
    } else if (type === 'Gitlab') {
      iconName = 'gitlab';
      iconColor = '#ea580c'
    }

    if (type === 'Github') {
      return <AntDesign name="github" size={92} color="#1e293b" />
    } else if (type === 'Gitlab') {
      return <AntDesign name="gitlab" size={92} color="#ea580c" />
    }
  }

  return (
    <>
      <BaseHeader options={{
        headerStyle: { backgroundColor: 'transparent', width: '100%', },
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
        )
      }} />
      <View style={styles.container}>
        
        {resolveTypeIcon()}
        <Text style={styles.titleText}>Connect to {type}</Text>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    width: '100%',
    height: 250,
  },

  titleText: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
  }
})

export default AuthHeader