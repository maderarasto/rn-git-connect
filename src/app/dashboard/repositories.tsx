import {View, TouchableOpacity, StyleSheet} from 'react-native'
import React, {useCallback} from 'react'
import {Drawer} from "expo-router/drawer";
import {AntDesign} from "@expo/vector-icons";
import DrawerHeader from "@src/components/headers/DrawerHeader";
import {DrawerHeaderProps} from "@react-navigation/drawer";
import useOwnerReposQuery from "@src/hooks/query/useOwnerReposQuery";
import RepositoryListItem from "@src/components/RepositoryListItem";
import RefreshList from "@src/components/RefreshList";
import {useFocusEffect} from "expo-router";

const RepositoriesScreen = () => {
  useFocusEffect(useCallback(() => {
    reloadRepos('owner_repos');
  }, []))

  const renderHeader = ({navigation, options}: DrawerHeaderProps) => (
    <DrawerHeader
      navigation={navigation}
      title={options.title}
      titleStyle={{ flex: 1 }}
      headerRight={() => (
        <>
          <TouchableOpacity onPress={() => {}}>
            <AntDesign name="search1" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <AntDesign name="plus" size={24} color="black" />
          </TouchableOpacity>
        </>
      )} />
  )

  const {
    data: repos,
    isFetching,
    hasNextPage,
    fetchNextPage,
    resetQuery: reloadRepos,
  } = useOwnerReposQuery({
    queryKey: 'owner_repos',
  });

  const onEventListReachedEnd = async () => {
    if (!isFetching && hasNextPage) {
      await fetchNextPage();
    }
  }

  return (
    <View style={styles.container}>
      <Drawer.Screen options={{
        header: renderHeader,
      }}/>
      <RefreshList
        data={repos?.pages.flat()}
        keyExtractor={(repo) => {
          return repo.id.toString();
        }}
        isLoading={isFetching}
        renderItem={({item: repo}) => {
          return <RepositoryListItem repository={repo} />;
        }}
        onEndReachedThreshold={0.5}
        onEndReached={onEventListReachedEnd}
        onRetry={() => reloadRepos()}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default RepositoriesScreen