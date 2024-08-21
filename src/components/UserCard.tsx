import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React from 'react'

import { User } from '@src/types'

export type UserCardProps = {
  user: User,
  style?: ViewStyle,
}

const UserCard = ({
  user,
  style = {},
}: UserCardProps) => {
  function resolveContainerStyle() {
    let containerStyle = {
      ...styles.container,
      ...style,
    };

    return containerStyle;
  }

  return (
    <View style={resolveContainerStyle()}>
      <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
      <View>
        <Text style={styles.userFullName}>{user.fullname}</Text>
        <Text style={styles.userUserName}>@{user.username}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    padding: 8,
  },

  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'gray',
  },

  userFullName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: -5,
  },

  userUserName: {
    fontFamily: 'Inter_400Regular',
    color: 'gray',
  }
})

export default UserCard