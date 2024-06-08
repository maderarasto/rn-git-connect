import { View, Text, StyleSheet } from 'react-native'
import React, { useRef } from 'react'
import RepositoryFilter from '@src/components/RepositoryFilter'
import SlidedModal, { SlidedModalMethods } from '@src/components/modals/SlidedModal'

const Page = () => {
  const filterModalRef = useRef<SlidedModalMethods>(null);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <RepositoryFilter modalRef={filterModalRef} />
      </View>
      <SlidedModal ref={filterModalRef}>
        <Text>Hello</Text>
      </SlidedModal>
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