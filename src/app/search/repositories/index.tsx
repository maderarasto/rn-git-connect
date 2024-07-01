import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ViewStyle } from 'react-native'
import React, { useState } from 'react'
import BaseHeader from '@src/components/BaseHeader'
import {AntDesign} from '@expo/vector-icons';
import LabeledTextInput from '@src/components/LabeledTextInput';
import { useRouter } from 'expo-router';
import { ProgrammingLanguages } from '@src/structures';
import TagItem from '@src/components/TagItem';

const Page = () => {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  function resolveFiltersContainerStyle() {
    const style: ViewStyle = {

    };

    if (searchText) {
      style.display = 'none';
    }

    return style;
  }

  function pickLanguageTag(tagLabel: string) {
    router.navigate(`search/repositories/list?language=${tagLabel}`);
  }

  function onSearchTextChange(text: string) {
    setSearchText(text);
  }

  function onBackPress() {
    router.back();
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
            value={searchText}
            onChangeText={onSearchTextChange}
            highlight={false} />
        )
      }} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={resolveFiltersContainerStyle()}>
          <Text style={styles.categoryLabel}>List your repositories by language</Text>
          <View style={styles.tagsContainer}>
            {ProgrammingLanguages.map((langItem, index) => (
              <TagItem 
                key={`tag[${index}]:${langItem}`} 
                tag={langItem} 
                onPress={() => pickLanguageTag(langItem)}
                interactive />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16
  },

  categoryLabel: {
    marginBottom: 8,
    color: '#6b7280',
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  }
})

export default Page