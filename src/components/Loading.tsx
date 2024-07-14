import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import {MaterialIcons} from '@expo/vector-icons';

export type LoadingProps = {
  message?: string
}

const Loading = ({
  message = 'Loading...'
}: LoadingProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large"  color="#666" />
      <Text style={styles.text}>{message}</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    width: '100%',
    height: '100%',
  },

  text: {
    fontSize: 16,
    color: 'gray',
  }
})

export default Loading