import { View, Text, StyleSheet, StyleProp, TextStyle } from "react-native";
import React from "react";
import {MaterialCommunityIcons} from '@expo/vector-icons';

export type BulletListOptions = {
  bulletIcon?: React.JSX.Element
  bulletStyle?: StyleProp<TextStyle>
}

export type BulletListProps = {
  type?: 'unordered'|'ordered',
  children?: React.JSX.Element | React.JSX.Element[],
  options?: BulletListOptions
};

const BulletList = ({ 
  type = 'unordered',
  options = {},
  children = []
}: BulletListProps) => {
  const items = !Array.isArray(children) ? [children] : children;

  function resolveBulletStyle() {
    return {
      ...styles.itemBullet,
      ...options.bulletStyle as object ?? {}
    }
  }

  function resolveBulletIcon() {
    if (!options.bulletIcon) {
      return <MaterialCommunityIcons name="circle-medium" size={16} color="black" style={resolveBulletStyle()} />;
    }

    return React.cloneElement(options.bulletIcon, { style: {
      ...options.bulletIcon.props.style ?? {},
      ...options.bulletStyle as object ?? {}
    }});
  }

  return (
    <View style={styles.listContainer}>
      {items.map((item, index) => (
        <View key={`bullet-list-item-${index}`} style={styles.itemContainer}>
          {type === 'unordered' ? resolveBulletIcon() : (
            <Text style={styles.itemOrder}>{index + 1}.</Text> 
          )}
          {item}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    gap: 2,
    paddingLeft: 8,
    paddingRight: 16,
    paddingVertical: 4,
  },

  itemContainer: {
    flexDirection: "row",
    alignItems: 'flex-start',
    gap: 4,
    paddingRight: 4,
  },

  itemOrder: {
    fontSize: 16,
  },

  itemBullet: {
    marginTop: 4,
  },

  itemText: {
    flexWrap: 'wrap',
    fontSize: 16
  }
});

export default BulletList;
