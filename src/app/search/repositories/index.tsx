import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import BaseHeader from '@src/components/BaseHeader'
import {AntDesign} from '@expo/vector-icons';
import LabeledTextInput from '@src/components/LabeledTextInput';
import { useRouter } from 'expo-router';
import TagPicker, { Tag } from '@src/components/TagPicker';
import { ProgrammingLanguages } from '@src/structures';

const Page = () => {
  const router = useRouter();

  function onBackPress() {
    router.back();
  }

  function onLanguageTagPick(tag: Tag) {
    router.navigate(`search/repositories/list?language=${tag.label}`);
  }

  return (
    <View>
      <BaseHeader options={{
        headerLeft: () => (
          <TouchableOpacity onPress={onBackPress}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
        ),
        titleStyle: {
          flex: 1,
        },
        headerRightStyle: {
          display: 'none',
        },
        title: () => (
          <LabeledTextInput 
            placeholder="Search in repositories"
            icon={<AntDesign name="search1" size={20} color="gray" />} 
            iconSide="right" 
            highlight={false} />
        )
      }} />
      <ScrollView contentContainerStyle={styles.containerContainer}>
        <Text style={styles.categoryLabel}>List your repositories by language</Text>
        <TagPicker items={ProgrammingLanguages} preselected={false} onPick={onLanguageTagPick} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  containerContainer: {
    padding: 16
  },

  categoryLabel: {
    marginBottom: 8,
    color: '#6b7280',
  }
})

export default Page