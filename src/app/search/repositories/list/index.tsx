import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useContext } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {AntDesign} from '@expo/vector-icons';
import BaseHeader from '@src/components/headers/BaseHeader';
import { AuthUserContext } from '@src/context/AuthUserContext';
import { AccountType } from '@src/types';
import { useSearchReposQuery } from '@src/hooks/useSearchReposQuery';
import RepositoryListItem from '@src/components/RepositoryListItem';
import NotFoundRecord from '@src/components/NotFoundRecord';
import Loading from '@src/components/Loading';

const Page = () => {
  const authUserContext = useContext(AuthUserContext);
  const {language} = useLocalSearchParams();
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
    { language: language as string },
  );

  function foundAnyRepositories() {
    if (!repositories) {
      return false;
    }

    return repositories.pages.flat().length > 0;
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
    <View style={{ flex: 1,}}>
      <BaseHeader options={{
        headerLeft: () => (
          <TouchableOpacity onPress={onBackPress}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
        ),
        titleStyle: {
          flex: 1,
        }, 
        title: `Repositories with ${language}`
      }} />
      <View style={{ position: 'relative', flex: 1, }}>
        {isFetching ? <Loading /> : ''}
        {!isFetching && !foundAnyRepositories() ? <NotFoundRecord message="No repositories found." /> : ''}
        {!isFetching ? (
          <FlatList 
            data={repositories?.pages.flat()} 
            renderItem={(({item: repo}) => (
              <RepositoryListItem key={repo.path} repository={repo} />
            ))}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            // onEndReachedThreshold={0.5}
            onEndReached={onRepoListReachedEnd} />
        ) : ''}
      </View>
    </View>
  )
}

export default Page