import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Repository } from '@src/types'

export type RepositoryListItemProps = {
  repository: Repository
}

const RepositoryListItem = ({
  repository
}: RepositoryListItemProps) => {
  return (
    <View style={styles.container}>
      <View style={{ width: 48, height: 48, borderRadius: 5, backgroundColor: '#ccc'}}></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.repositoryTitle}>{repository.name}</Text>
        <Text style={styles.repositoryDescription}>
          {repository.description}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc'
  },

  repositoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  repositoryDescription: {
    flexWrap: 'wrap',
    fontSize: 12,
    color: '#666'
  }
})

export default RepositoryListItem