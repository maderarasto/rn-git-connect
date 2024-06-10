import { View, Text, StyleSheet } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import RepositoryFilter, { RepositoryFilterData } from '@src/components/RepositoryFilter'
import Dialog, { DialogMethods } from '@src/components/dialogs/Dialog';
import { SortBy } from '@src/types';
import { AuthUserContext } from '@src/context/AuthUserContext';
import { ApiType, AuthUser } from '@src/api/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import DrawerHeader from '@src/components/DrawerHeader';
import { useNavigation } from 'expo-router';

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