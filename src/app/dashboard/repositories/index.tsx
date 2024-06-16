import { View, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { AccountType } from '@src/types';
import { AuthUserContext } from '@src/context/AuthUserContext';
import { FlatList } from 'react-native-gesture-handler';
import { useAuthReposQuery } from '@src/hooks/useAuthReposQuery';
import RepositoryListItem from '@src/components/RepositoryListItem';
import { Drawer } from 'expo-router/drawer';
import DrawerHeader from '@src/components/DrawerHeader';
import {AntDesign} from '@expo/vector-icons';

const Page = () => {
  const authUserContext = useContext(AuthUserContext);

  if (!authUserContext) {
    throw new Error('AuthUserContext must be used withing AUthUserProvider!');
  }

  const {
    data: repositories,
    isFetching,
    error,
    fetchNextPage
  } = useAuthReposQuery(
    authUserContext.user?.accountType as AccountType, 
  );
  
  // function filteredByLanguage() {
  //   return repositories;
  // }

  // function onFilterChanged({languages, sortBy}: RepositoryFilterData) {
  //   setLanguage(languages[0]);
  //   setSortBy(sortBy);
  // }

  function onRepoListReachedEnd() {
    if (!isFetching && fetchNextPage) {
      fetchNextPage();
    }
  }

  return (
    <View style={styles.contentContainer}>
      <Drawer.Screen options={{
        header: ({ navigation, route, options }) => (
          <DrawerHeader 
            navigation={navigation}
            title={options.title}
            titleStyle={{ flex: 1 }}
            headerRight={() => (
              <>
                <TouchableOpacity>
                  <AntDesign name="search1" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <AntDesign name="plus" size={24} color="black" />
                </TouchableOpacity>
              </>
            )} />
        ),
      }} />

      <FlatList 
        data={repositories?.pages.flat()} 
        renderItem={(({item: repo}) => (
          <RepositoryListItem key={repo.path} repository={repo} />
        ))}
        onEndReachedThreshold={0.5}
        onEndReached={onRepoListReachedEnd} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 16,
  }
})

export default Page