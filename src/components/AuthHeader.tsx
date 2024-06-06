import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import {FontAwesome} from '@expo/vector-icons';


type AuthHeaderParams = {
  title: string
  icon?: React.JSX.Element,
}

const AuthHeader = ({
  title,
  icon = <FontAwesome name="sign-in" size={92} color="black" /> 
}: AuthHeaderParams) => {
  return (
    <View style={styles.container}>
      {icon}
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32,
        width: '100%',
        height: 350,
    },

    title: {
      fontSize: 20,
      fontFamily: 'Inter_600SemiBold',
    }
})

export default AuthHeader