import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { useAuthReposQuery } from '@src/hooks/useAuthReposQuery';
import RepositoryListItem from '@src/components/RepositoryListItem';
import { Drawer } from 'expo-router/drawer';
import DrawerHeader from '@src/components/DrawerHeader';
import {AntDesign} from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Page = () => {
  const router = useRouter();

  const {
    data: repositories,
    isFetching,
    error,
    fetchNextPage
  } = useAuthReposQuery();

  function onSearchIconPress() {
    router.navigate('search/repositories');
  }

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
                <TouchableOpacity onPress={onSearchIconPress}>
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