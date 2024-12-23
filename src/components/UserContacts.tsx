import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { FontAwesome5, Feather } from '@expo/vector-icons';
import { User } from '@src/api/types';

export type UserContactsProps = {
  user: User
  style?: ViewStyle
}

const UserContacts = ({
  user,
  style = {},
}: UserContactsProps) => {
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
        {user.email ? (
          <View style={styles.row}>
            <Feather name="mail" size={16} color="black" style={styles.icon} />
            <Text>{user.email}</Text>
          </View>
        ) : ''}
        {user.url ? (
          <View style={styles.row}>
            <FontAwesome5 name="globe" size={16} color="black" style={styles.icon} />
            <Text>{user.url}</Text>
          </View>
        ) : ''}
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

export default UserContacts;
