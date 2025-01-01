import {StyleSheet, Text, TouchableOpacity, View, ViewStyle} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import {useRouter} from "expo-router";
import SearchHeader from "@src/components/headers/SearchHeader";
import UnfocusView from "@src/components/views/UnfocusView";
import TagPicker from "@src/components/TagPicker";
import {ProgrammingLanguages} from "@src/utils/structs";
import {Tag} from "@src/types";
import RefreshList from "@src/components/RefreshList";
import useSearchReposQuery from "@src/hooks/query/useSearchReposQuery";
import {useAuth} from "@src/providers/AuthProvider";
import RepositoryListItem from "@src/components/RepositoryListItem";

const SearchRepositoriesScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [isQueryEnabled, setIsQueryEnabled] = useState(false);

  const router = useRouter();
  const authContext = useAuth();

  if (!authContext || !authContext.user) {
    return null;
  }

  const {
    data: repos,
    isFetching,
    hasNextPage,
    refetch,
    fetchNextPage,
    resetQuery: reloadRepos,
  } = useSearchReposQuery({
    queryKey: 'search_repos',
    params: {
      owner: authContext.user.username ?? '',
      membership: true,
      searchText,
    },
    enabled: isQueryEnabled,
  });

  useEffect(() => {
    setIsQueryEnabled(searchText.length > 0);

    if (searchText.length > 0) {
      refetch();
    }
  }, [searchText]);

  const resolveTagFilterStyle = () => {
    const resolvedStyle: ViewStyle = {
      ...styles.tagFilter,
    };

    if (isQueryEnabled) {
      resolvedStyle.height = 0;
      resolvedStyle.display = 'none';
    }

    return resolvedStyle;
  }

  const onBackPress = () => {
    router.back();
  }

  const onSearchTextChange = (text: string) => {
    setSearchText(text);
  }

  const onSearchTextClear = () => {
    console.log('clear');
  }

  const onPickLanguage = (tag: Tag) => {
    router.push(`search/repositories/list?language=${tag.label}`);
  }

  const onRepoListReachedEnd = async () => {
    if (!isFetching && hasNextPage) {
      await fetchNextPage();
    }
  }

  return (
    <UnfocusView style={styles.container}>
      <SearchHeader
        searchPlaceholder="Search in repositories"
        onChangeText={onSearchTextChange}
        onClearText={onSearchTextClear}
        options={{
          titleStyle: { flex: 1, },
          headerLeft: () => (
            <TouchableOpacity onPress={onBackPress}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
          title: 'Repositories',
        }}
      />
      <View style={resolveTagFilterStyle()}>
        <Text style={{ marginBottom: 8, fontSize: 14, color: 'gray' }}>List your repositories by language</Text>
        <TagPicker items={[...ProgrammingLanguages]} highlight={false} onPick={onPickLanguage} />
      </View>
      {isQueryEnabled ? (
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
          onEndReached={onRepoListReachedEnd}
          onRetry={() => reloadRepos()}/>
      ) : ''}
    </UnfocusView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  tagFilter: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    overflow: 'hidden',
  }
})

export default SearchRepositoriesScreen;