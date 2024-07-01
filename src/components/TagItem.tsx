import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native'
import React from 'react'
import { Tag } from '@src/types'

type TagItemProps = {
  tag: Tag|string
  tagStyle?: ViewStyle
  tagTextStyle?: TextStyle
  interactive?: boolean
  onPress?: () => void
}

const TagItem = ({
  tag,
  tagStyle,
  tagTextStyle,
  interactive = false,
  onPress
}: TagItemProps) => {
  function resolveTagStyle() {
    let style = {
      ...styles.tagContainer,
      ...tagStyle
    };

    return style;
  }

  function resolveTagTextStyle() {
    let style = {
      ...styles.tagText,
      ...tagTextStyle
    };

    return style;
  }

  function resolveTagNode() {
    const tagLabel = typeof tag !== 'string'
      ? tag.label
      : tag;

    return (
      <View style={resolveTagStyle()}>
        <Text style={resolveTagTextStyle()}>{tagLabel}</Text>
      </View>
    )
  }

  if (!interactive) {
    return resolveTagNode();
  }

  return (
    <TouchableOpacity onPress={onPress}>
      {resolveTagNode()}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    minWidth: 40,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'lightgray',
  },

  tagText: {
    color: 'black',
  }
});

export default TagItem