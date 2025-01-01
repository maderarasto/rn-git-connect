import {Platform, StyleSheet, ToastAndroid, TouchableOpacity, View} from "react-native";
import {useFocusEffect, useLocalSearchParams, useRouter} from "expo-router";
import {useAuth} from "@src/providers/AuthProvider";
import BaseHeader from "@src/components/headers/BaseHeader";
import {AntDesign} from "@expo/vector-icons";
import React, {useCallback} from "react";
import useSearchReposQuery from "@src/hooks/query/useSearchReposQuery";
import RepositoryListItem from "@src/components/RepositoryListItem";
import RefreshList from "@src/components/RefreshList";

const SearchRepositoriesListScreen = () => {
  const {language} = useLocalSearchParams<{ language: string }>();

  const authContext = useAuth();
  const router = useRouter();

  if (!language) {
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity('Missing programming language', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    }

    router.back();
  }

  const onBackPress = () => {
    router.back();
  }

  if (!authContext || !authContext.user) {
    return null;
  }

  const {
    data: repos,
    isFetching,
    hasNextPage,
    fetchNextPage,
    resetQuery: reloadRepos,
    invalidateQuery,
  } = useSearchReposQuery({
    queryKey: 'filter_repos',
    params: {
      owner: authContext.user.username ?? '',
      membership: true,
      language,
    }
  });

  useFocusEffect(useCallback(() => {
    return () => {
      invalidateQuery('filter_repos');
    }
  }, []))

  const onEventListReachedEnd = async () => {
    if (!isFetching && hasNextPage) {
      await fetchNextPage();
    }
  }

  return (
    <View style={styles.container}>
      <BaseHeader options={{
        titleStyle: { flex: 1 },
        headerLeft: () => (
          <TouchableOpacity onPress={onBackPress}>
            <AntDesign name="arrowleft" size={24} color="black"/>
          </TouchableOpacity>
        ),
        title: `Repositories with ${language}`,
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default SearchRepositoriesListScreen;