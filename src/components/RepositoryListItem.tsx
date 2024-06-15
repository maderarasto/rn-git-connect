import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { Repository } from '@src/types'
import { convertToSlug, getRelativeTime } from '@src/utils'

export type RepositoryListItemProps = {
  repository: Repository
}

const RepositoryListItem = ({
  repository
}: RepositoryListItemProps) => {
  return (
    <View style={styles.container}>
      <View style={{ width: 48, height: 48, borderRadius: 5, backgroundColor: '#ccc'}}></View>
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.repositoryTitle}>{repository.name}</Text>
          {repository.description ? (
            <Text style={styles.repositoryDescription}>{repository.description}</Text>
          ) : ''}
        </View>
        {repository.topics?.length ? (
          <View style={styles.repositoryTagContainer}>
            {repository.topics?.map((repo, index) => (
              <Text 
                key={`tag[${index}]:${convertToSlug(repo)}`}
                style={styles.repositoryTag}
              >
                {repo}
              </Text>
            ))}
          </View>
        ) : ''}
        <View style={{ ...styles.centerInRow, justifyContent: 'space-between'}}>
          <View style={styles.centerInRow}>
            <MaterialCommunityIcons name="circle-medium" size={24} color="#2563eb" style={{marginHorizontal: -4}} />
            <Text style={styles.secondaryText}>{repository.language}</Text>
          </View>
          {repository.updatedAt ? (
            <Text style={styles.secondaryText}>{getRelativeTime(repository.updatedAt)}</Text>
          ) : ''}
        </View>
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
    marginBottom: 8, 
    fontSize: 12,
    color: '#666'
  },

  repositoryTagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  repositoryTag: {
    flexDirection: 'row',
    minWidth: 40,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    backgroundColor: 'lightgray',
  },

  secondaryText: {
    fontSize: 12,
    color: '#666',
  },

  centerInRow: {
    flexDirection: 'row',
    alignItems: 'center',
  }
})

export default RepositoryListItem