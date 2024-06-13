import { View, StyleSheet } from 'react-native'
import React, { useContext, useState } from 'react'
import RepositoryFilter, { RepositoryFilterData } from '@src/components/RepositoryFilter'
import { SortBy } from '@src/types';
import { AuthUserContext } from '@src/context/AuthUserContext';
import { ScrollView } from 'react-native-gesture-handler';

const Page = () => {
  const [language, setLanguage] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('Last updated');
  
  const authUserContext = useContext(AuthUserContext);

  if (!authUserContext) {
    throw new Error('AuthUserContext must be used withing AUthUserProvider!');
  }

  function onFilterChanged({languages, sortBy}: RepositoryFilterData) {
    setLanguage(languages[0]);
    setSortBy(sortBy);
  }

  return (
    <ScrollView>
      <View style={styles.contentContainer}>
        <RepositoryFilter onChange={onFilterChanged} />
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