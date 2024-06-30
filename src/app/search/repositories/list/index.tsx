import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {AntDesign} from '@expo/vector-icons';
import BaseHeader from '@src/components/BaseHeader';

const Page = () => {
  const {language} = useLocalSearchParams();
  const router = useRouter();

  function onBackPress() {
    router.back();
  }

  return (
    <View>
      <BaseHeader options={{
        headerLeft: () => (
          <TouchableOpacity onPress={onBackPress}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
        ),
        titleStyle: {
          flex: 1,
        }, 
        title: `Repositories with ${language}`
      }} />
      <Text>Page: {language}</Text>
    </View>
  )
}

export default Page