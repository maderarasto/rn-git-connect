import {View, TouchableOpacity, StyleSheet} from 'react-native'
import React from 'react'
import {Drawer} from "expo-router/drawer";
import {AntDesign} from "@expo/vector-icons";
import DrawerHeader from "@src/components/headers/DrawerHeader";
import {DrawerHeaderProps} from "@react-navigation/drawer";
import useMemberReposQuery from "@src/hooks/query/useMemberReposQuery";
import RepositoryListItem from "@src/components/RepositoryListItem";
import RefreshList from "@src/components/RefreshList";
import {useRouter} from "expo-router";
import useResumeHandler from "@src/hooks/useResumeHandler";

const RepositoriesScreen = () => {
  const router = useRouter();

  useResumeHandler(() => {
    reloadRepos('member_repos');
  });

  const renderHeader = ({navigation, options}: DrawerHeaderProps) => (
    <DrawerHeader
      navigation={navigation}
      title={options.title}
      titleStyle={{ flex: 1 }}
      headerRight={() => (
        <>
          <TouchableOpacity onPress={() => router.navigate('(main)/search/repositories')}>
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
  } = useMemberReposQuery({
    queryKey: 'member_repos',
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