import { View, Text, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import RepositoryFilter, { RepositoryFilterData } from '@src/components/RepositoryFilter'
import Dialog, { DialogMethods } from '@src/components/dialogs/Dialog';
import { SortBy } from '@src/types';

const Page = () => {
  const [language, setLanguage] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('Last updated');

  function onFilterChanged({languages, sortBy}: RepositoryFilterData) {
    setLanguage(languages[0]);
    setSortBy(sortBy);
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <RepositoryFilter onChange={onFilterChanged} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    padding: 14,
  }
})

export default Page