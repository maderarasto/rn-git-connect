import { View, Text, StyleSheet } from 'react-native'
import {MaterialIcons} from '@expo/vector-icons';

export type NotFoundRecordProps = {
  message?: string
}

const NotFoundRecord = ({
  message = 'Not found records'
}: NotFoundRecordProps) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="search-off" size={64} color="#b2b2b2" />
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
    width: '100%',
    height: '100%',
  },

  text: {
    fontSize: 16,
    color: 'gray',
  }
})

export default NotFoundRecord