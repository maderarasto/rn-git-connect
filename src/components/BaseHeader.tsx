import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export type BaseHeaderOptions = {
  title?: string | (() => ReactNode)
  titleStyle?: ViewStyle
  headerLeft?: () => ReactNode
  headerLeftStyle?: ViewStyle
  headerRight?: () => ReactNode
  headerRightStyle?: ViewStyle
}

export type BaseHeaderProps = {
  options?: BaseHeaderOptions
}

const BaseHeader = ({
  options = {}
}: BaseHeaderProps) => {

  function resolveTitle() {
    if (!options.title) {
      return undefined;
    }

    return typeof options.title === 'string' ? (
      <Text style={styles.headerTitle}>{options.title}</Text>
    ) : options.title();
  }

  function resolveTitleStyle() {    
    let style = {
      ...styles.headerTitle,
      ...options.titleStyle
    }

    return style;
  }

  function resolveHeaderLeftStyle() {
    let style = {
      ...styles.headerSide,
      ...options.headerLeftStyle
    }

    return style;
  }

  function resolveHeaderRightStyle() {
    let style = {
      ...styles.headerSide,
      ...options.headerRightStyle
    }

    return style;
  }

  return (
    <SafeAreaView style={styles.header}>
      <View style={resolveHeaderLeftStyle()}>
      {options.headerLeft ? options.headerLeft() : ''}
      </View>
      <View style={resolveTitleStyle()}>{resolveTitle()}</View>
      <View style={resolveHeaderRightStyle()}>
        {options.headerRight ? options.headerRight() : ''}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    height: 90,
    paddingHorizontal: 17,
    backgroundColor: '#dedede'
  },

  headerSide: {
    flexDirection: 'row',
    gap: 16,
    minWidth: 20,
    minHeight: 20,
  },

  headerTitle: {
    flexDirection: 'row',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default BaseHeader