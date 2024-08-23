import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { FontAwesome5, Feather } from '@expo/vector-icons';
import { User } from '@src/types';

export type UserContactProps = {
  user: User
  style?: ViewStyle
}

const UserContact = ({
  user,
  style = {},
}: UserContactProps) => {
  function resolveContainerStyle() {
    let containerStyle: ViewStyle = {
      ...style,
    };

    return containerStyle;
  }
  
  return (
    <View style={resolveContainerStyle()}>
      <Text style={styles.title}>Contact</Text>
      <View>
        <View style={styles.row}>
          <Feather name="mail" size={16} color="black" style={styles.icon} />
          <Text>{user.email}</Text>
        </View>
        <View style={styles.row}>
          <FontAwesome5 name="globe" size={16} color="black" style={styles.icon} />
          <Text>{user.webUrl}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingRight: 4,
    paddingLeft: 2,
  },

  icon: {
    minWidth: 16,
    color: '#78716c',
  }
})

export default UserContact;