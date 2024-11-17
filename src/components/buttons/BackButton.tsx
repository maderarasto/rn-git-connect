import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import {AntDesign} from '@expo/vector-icons';
import React from 'react'

const BackButton = () => {
  const router = useRouter();

  const onBackPress = () => {
    router.back();
  }

  return (
    <TouchableOpacity onPress={onBackPress}>
      <AntDesign name="arrowleft" size={24} color="black" />
    </TouchableOpacity>
  )
}

export default BackButton