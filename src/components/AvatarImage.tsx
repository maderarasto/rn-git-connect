import {Image, StyleSheet, Text, View, ViewStyle} from "react-native";

export type AvatarImageProps = {
  imageUrl?: string
  letterFrom?: string
  backgroundColor?: string
}

const AvatarImage = ({
  imageUrl,
  letterFrom,
  backgroundColor,
}: AvatarImageProps) => {
  const resolveFirstLetter = () => {
    if (!letterFrom) {
      return '';
    }

    return letterFrom.charAt(0);
  }

  const resolveDefaultAvatarStyle = () => {
    const avatarStyle: ViewStyle = {
      ...styles.container,
      ...styles.defaultAvatar,
    }

    if (backgroundColor) {
      avatarStyle.backgroundColor = backgroundColor;
    }

    return avatarStyle;
  }

  if (imageUrl) {
    return <Image src={imageUrl} style={styles.container} />;
  }

  return (
    <View style={resolveDefaultAvatarStyle()}>
      <Text style={styles.defaultLetter}>{resolveFirstLetter()}</Text>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 5,
  },

  defaultAvatar: {
    backgroundColor: '#ccc',
  },

  defaultLetter: {
    fontSize: 24,
    fontFamily: 'Inter_500Medium',
    textTransform: 'uppercase',
    color: '#ffffff90'
  }
})

export default AvatarImage;