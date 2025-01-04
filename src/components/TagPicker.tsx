import {StyleSheet, TextStyle, View, ViewStyle} from 'react-native'
import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react'
import TagItem from './TagItem';
import {Tag} from "@src/types";

export type TagPickerMethods = {
  reset: () => void
}

export type TagPickerProps = {
  items: (string | Tag)[]
  tagIcon?: React.JSX.Element,
  multiple?: boolean
  highlight?: boolean
  onPick?: (tag: Tag) => void
  onChange?: (tags: Tag[]) => void
  onLayout?: () => void
}

const TagPicker = forwardRef<TagPickerMethods, TagPickerProps>(({
  items,
  multiple = false,
  highlight = true,
  onPick,
  onChange,
  onLayout,
}: TagPickerProps, ref) => {
  const [tags, setTags] = useState<Tag[]>([]);

  useImperativeHandle(ref, () => ({
    reset() {
      setTags(initializeTags());
    }
  }))

  useEffect(() => {
    setTags(initializeTags());
  }, []);

  useEffect(() => {
    if (onChange) {
      onChange(tags.filter((tag) => tag.selected));
    }
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
        tag.selected = multiple ? index === 0 : false
      } else {
        tag.label = item.label;
        tag.key = item.key ? item.key : `tag[${index}]:${item}`;
        tag.selected = selectable ? !!item.selected : false;
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

    if (tag.selected && highlight) {
      style.backgroundColor = '#2563eb';
    }

    return style;
  }

  function resolveTagTextStyle(tag: Tag) {
    let style: TextStyle = {
      color: 'black',
    };

    if (tag.selected && highlight) {
      style.color = 'white';
    }

    return style;
  }

  function pickTag(tag: Tag) {
    setTags((oldTags) => {
      return oldTags.map((oldTag) => ({
        ...oldTag,
        selected: oldTag.key === tag.key
          ? multiple ? !oldTag.selected : true
          : multiple ? !!oldTag.selected : false
      }));
    });

    if ((!multiple && !tag.selected) || !tag.selected) {
      if (onPick) {
        onPick({ ...tag, selected: true });
      }
    }
  }

  return (
    <View style={styles.container} onLayout={onLayout}>
      {tags.map((tag) => (
        <TagItem
          key={tag.key}
          tag={tag}
          tagStyle={resolveTagStyle(tag)}
          tagTextStyle={resolveTagTextStyle(tag)}
          onPress={() => pickTag(tag)}
          interactive/>
      ))}
    </View>
  )
});

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
