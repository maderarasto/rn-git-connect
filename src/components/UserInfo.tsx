import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import {FontAwesome5, FontAwesome6, Entypo } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { User } from '@src/api/types';

export type UserInfoProps = {
  user: User
  style?: ViewStyle
}

const UserInfo = ({
  user,
  style = {},
}: UserInfoProps) => {
  function resolveContainerStyle() {
    let containerStyle: ViewStyle = {
      ...style,
    };

    return containerStyle;
  }

  function resolveDate() {
    return dayjs(user.createdAt).format('MMMM D, YYYY');
  }

  return (
    <View style={resolveContainerStyle()}>
      <Text style={styles.title}>Info</Text>
      <View>
        <View style={styles.row}>
          <FontAwesome6 name="building" size={16} color="black" style={styles.icon} />
          <Text style={{ fontSize: 14, }}>{user.company}</Text>
        </View>
        <View style={styles.row}>
          <FontAwesome6 name="location-pin" size={16} color="black" style={styles.icon}  />
          <Text>{user.location}</Text>
        </View>
        <View style={styles.row}>
          <FontAwesome6 name="building" size={16} color="black" style={styles.icon}  />
          <Text>Member since {resolveDate()}</Text>
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

export default UserInfo;
