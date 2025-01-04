import {StyleSheet, Text, TouchableOpacity, ViewStyle} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useFocusEffect, useRouter} from "expo-router";
import SearchHeader from "@src/components/headers/SearchHeader";
import UnfocusView from "@src/components/views/UnfocusView";
import TagPicker, {TagPickerMethods} from "@src/components/TagPicker";
import {ProgrammingLanguages} from "@src/utils/structs";
import {Tag} from "@src/types";
import RefreshList from "@src/components/RefreshList";
import useSearchReposQuery from "@src/hooks/query/useSearchReposQuery";
import {useAuth} from "@src/providers/AuthProvider";
import RepositoryListItem from "@src/components/RepositoryListItem";
import AnimatedView, {AnimatedViewMethods} from "@src/components/views/AnimatedView";

const SearchRepositoriesScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [isQueryEnabled, setIsQueryEnabled] = useState(false);
  const filterView = useRef<AnimatedViewMethods>(null);
  const tagPicker = useRef<TagPickerMethods>(null);

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

  useFocusEffect(useCallback(() => {
    tagPicker.current?.reset();
  }, []));

  useEffect(() => {
    const hasSearchText = searchText.length > 0;
    filterView.current?.animate(!hasSearchText ? 'in' : 'out');

    setTimeout(() => {
      setIsQueryEnabled(searchText.length > 0);
    }, hasSearchText ? 500 : 0);

    if (hasSearchText) {
      refetch();
    }
  }, [searchText]);

  const resolveTagFilterStyle = () => {
    const resolvedStyle: ViewStyle = {
      ...styles.tagFilter,
    };

    if (isQueryEnabled) {
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
      {/*<Animated.View style={resolveTagFilterStyle()}>*/}
      {/*  <Text style={{ marginBottom: 8, fontSize: 14, color: 'gray' }}>List your repositories by language</Text>*/}
      {/*  <TagPicker ref={tagPicker} items={[...ProgrammingLanguages]} highlight={false} onPick={onPickLanguage} />*/}
      {/*</Animated.View>*/}
      <AnimatedView ref={filterView} animation="expand" startAt="mount" duration={500} style={resolveTagFilterStyle()}>
        <Text style={{ marginBottom: 8, fontSize: 14, color: 'gray' }}>List your repositories by language</Text>
        <TagPicker ref={tagPicker} items={[...ProgrammingLanguages]} highlight={false} onPick={onPickLanguage} />
      </AnimatedView>
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