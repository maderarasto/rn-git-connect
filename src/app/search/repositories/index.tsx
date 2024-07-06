import { View, TouchableOpacity, ScrollView, Text, StyleSheet, ViewStyle, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import BaseHeader from '@src/components/BaseHeader'
import {AntDesign} from '@expo/vector-icons';
import LabeledTextInput from '@src/components/LabeledTextInput';
import { useRouter } from 'expo-router';
import { ProgrammingLanguages } from '@src/structures';
import TagItem from '@src/components/TagItem';
import { useSearchReposQuery } from '@src/hooks/useSearchReposQuery';
import { AuthUserContext } from '@src/context/AuthUserContext';
import { AccountType } from '@src/types';
import RepositoryListItem from '@src/components/RepositoryListItem';

const Page = () => {
  const [searchText, setSearchText] = useState('');
  const authUserContext = useContext(AuthUserContext);
  const router = useRouter();

  if (!authUserContext) {
    throw new Error('AuthUserContext must be used withing AUthUserProvider!');
  }

  const {
    data: repositories,
    isFetching,
    error,
    refetch,
    fetchNextPage
} = useSearchReposQuery(
    authUserContext.user?.accountType as AccountType,
    authUserContext.user?.username as string,
    { searchText },
    searchText !== ''
  );

  useEffect(() => {
    refetch();
  }, [searchText]);

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

  function onRepoListReachedEnd() {
    if (!isFetching && fetchNextPage) {
      fetchNextPage();
    }
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
            style={{ flex: 1, }}
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
      {searchText !== '' ? (
        <View style={{ paddingVertical: 8 }}>
          <Text style={styles.searchTextLabel}>Search results</Text>
          <FlatList 
            data={repositories?.pages.flat()} 
            renderItem={(({item: repo}) => (
              <RepositoryListItem key={repo.path} repository={repo} />
            ))}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            onEndReachedThreshold={0.5}
            onEndReached={onRepoListReachedEnd} />
        </View>
      ) : ''}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    // paddingVertical: 8,
  },

  categoryLabel: {
    marginBottom: 8,
    color: '#6b7280',
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },

  searchTextLabel: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontSize: 12, 
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
    color: '#6b7280',
  }
})

export default Page