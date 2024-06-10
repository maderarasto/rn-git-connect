import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { ReactNode } from 'react'
import {AntDesign} from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import {ParamListBase} from '@react-navigation/native';

export type DrawerHeaderProps = {
  navigation?: DrawerNavigationProp<ParamListBase>
  title?: string|ReactNode
  
}

const DrawerHeader = ({
  navigation,
  title
}: DrawerHeaderProps) => {
  function resolveTitle() {
    return typeof title === 'string' ? (
      <Text style={styles.headerTitle}>{title}</Text>
    ) : title;
  }

  function onDrawerButtonPress() {
    navigation?.openDrawer();
  }

  return (
    <SafeAreaView style={styles.header}>
      <View style={styles.headerSide}>
        <TouchableOpacity onPress={onDrawerButtonPress}>
          <AntDesign name="menu-fold" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <View>{resolveTitle()}</View>
      <View style={styles.headerSide}></View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 90,
    paddingHorizontal: 17,
  },

  headerSide: {
    minWidth: 20,
    minHeight: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default DrawerHeader