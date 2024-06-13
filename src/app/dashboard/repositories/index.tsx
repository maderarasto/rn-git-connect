import { View, StyleSheet } from 'react-native'
import React, { useContext, useState } from 'react'
import RepositoryFilter, { RepositoryFilterData } from '@src/components/RepositoryFilter'
import { AccountType, SortBy } from '@src/types';
import { AuthUserContext } from '@src/context/AuthUserContext';
import { ScrollView } from 'react-native-gesture-handler';
import { useUserReposQuery } from '@src/hooks/useUserReposQuery';
import RepositoryListItem from '@src/components/RepositoryListItem';

const Page = () => {
  const [language, setLanguage] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('Last updated');
  
  const authUserContext = useContext(AuthUserContext);

  if (!authUserContext) {
    throw new Error('AuthUserContext must be used withing AUthUserProvider!');
  }

  const {
    data: repositories,
    isLoading,
    error
  } = useUserReposQuery(
    authUserContext.user?.accountType as AccountType, 
    authUserContext.user?.username ?? '',
    {}
  );
  
  function filteredByLanguage() {
    return repositories;
  }

  function onFilterChanged({languages, sortBy}: RepositoryFilterData) {
    setLanguage(languages[0]);
    setSortBy(sortBy);
  }

  return (
    <ScrollView style={styles.contentContainer}>
      <RepositoryFilter onChange={onFilterChanged} />
      <View style={{paddingVertical: 20}}>
        {filteredByLanguage()?.map((repo) => (
          <RepositoryListItem key={repo.path} repository={repo} />
        ))}
      </View>
    </ScrollView>
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