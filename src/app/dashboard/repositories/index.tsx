import { View, Text, StyleSheet } from 'react-native'
import React, { useRef } from 'react'
import RepositoryFilter from '@src/components/RepositoryFilter'
import { DialogMethods } from '@src/components/dialogs/Dialog';

const Page = () => {
  const filterModalRef = useRef<DialogMethods>(null);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <RepositoryFilter modalRef={filterModalRef} />
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