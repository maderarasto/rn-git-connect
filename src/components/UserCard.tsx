import { Image, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import React from 'react'
import { User } from '@src/api/types'

export type UserCardProps = {
  user: User
  size?: 'small' | 'large'
  style?: ViewStyle
}

const UserCard = ({
  user,
  size = 'small',
  style = {},
}: UserCardProps) => {
  function resolveContainerStyle() {
    let containerStyle = {
      ...styles.container,
      ...style,
    };

    if (size === 'large') {
      containerStyle.padding = 24;
    }

    return containerStyle;
  }

  function resolveAvatarStyle() {
    let avatarStyle = {
      ...styles.avatarImage,
    };

    if (size === 'large') {
      avatarStyle.width = 72;
      avatarStyle.height = 72;
    }

    return avatarStyle;
  }

  function resolveFullNameStyle() {
    let textStyle = {
      ...styles.userFullName,
    };

    if (size === 'large') {
      textStyle.fontSize = 20;
    }

    return textStyle;
  }

  function resolveUsernameStyle() {
    let textStyle: TextStyle = {
      ...styles.userUserName,
    };

    if (size === 'large') {
      textStyle.fontSize = 16;
    }

    return textStyle;
  }

  return (
    <View style={resolveContainerStyle()}>
      <Image source={{ uri: user.avatarUrl }} style={resolveAvatarStyle()} />
      <View>
        <Text style={resolveFullNameStyle()}>{user.fullname}</Text>
        <Text style={resolveUsernameStyle()}>@{user.username}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: 'center',
    gap: 16,
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
});

export default UserCard;
