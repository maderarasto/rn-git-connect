import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native';
import { convertToSlug } from '@src/utils'

export type Tag = {
  label: string
  key?: string
  selected?: boolean
}

export type TagPickerProps = {
  items?: (string|Tag)[]
  tagIcon?: React.JSX.Element,
  multiple?: boolean
  preselected?: boolean
  onPick?: (tag: Tag) => void
  onChange?: (tags: Tag[]) => void
}

const TagPicker = ({
  items = [],
  multiple = false,
  preselected = true,
  onPick = () => {},
  onChange = () => {},
}: TagPickerProps) => {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    setTags(initializeTags());
  }, []);

  useEffect(() => {
    onChange(tags.filter((tag) => tag.selected));
  }, [tags]);

  function initializeTags() {
    let selectable = true;

    return items.map((item, index) => {
      const tag: Tag = {
        label: '',
        key: '',
        selected: false
      };

      if (typeof item === 'string') {
        tag.label = item;
        tag.key = `tag[${index}]:${item}`;
        tag.selected = !multiple ? preselected && index === 0 : false
      } else {
        tag.label = item.label;
        tag.key = item.key ? item.key : `tag[${index}]:${item}`;
        tag.selected = selectable ? preselected && !!item.selected : false;
      }

      if (tag.selected && !multiple) {
        selectable = false;
      }

      return tag;
    });
  }

  function resolveTagStyle(tag: Tag) {
    let style: ViewStyle = {
      ...styles.tagItem,
    };

    if (tag.selected) {
      style.backgroundColor = '#2563eb';
    }

    return style;
  }

  function resolveTagTextStyle(tag: Tag) {
    let style: TextStyle = {
      color: 'black',
    };

    if (tag.selected) {
      style.color = 'white';
    }

    return style;
  }

  function pickTag(tag: Tag) {
    setTags((oldTags) => {
      const newTags = oldTags.map((oldTag) => ({
        ...oldTag,
        selected: oldTag.key === tag.key 
          ? multiple ? !oldTag.selected : true 
          : multiple ? !!oldTag.selected : false
      }));

      return newTags;
    });
    
    if ((!multiple && !tag.selected) || !tag.selected) {
      onPick({
        ...tag,
        selected: true
      });
    }
  }

  return (
    <View style={styles.container}>
      {tags.map((tag) => (
        <TouchableOpacity 
          key={tag.key} 
          onPress={() => pickTag(tag)}
        >
          <View style={resolveTagStyle(tag)}>
            <Text style={resolveTagTextStyle(tag)}>{tag.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  tagItem: {
    flexDirection: 'row',
    minWidth: 40,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'lightgray',
  }
})

export default TagPicker