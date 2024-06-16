import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { Repository } from '@src/types'
import { convertToSlug, getRelativeTime } from '@src/utils'
import { TouchableOpacity } from 'react-native-gesture-handler';

export type RepositoryListItemProps = {
  repository: Repository
}

const RepositoryListItem = ({
  repository
}: RepositoryListItemProps) => {
  return (
    <TouchableOpacity style={styles.container}>
      {repository.avatarUrl ? (
        <Image src={repository.avatarUrl} style={styles.repositoryAvatar} />
      ) : (
        <View style={{ 
          ...styles.repositoryAvatar, 
          backgroundColor: '#ccc'
        }}></View>
      )}
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.repositoryTitle}>{repository.fullname}</Text>
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
          {repository.language ? (
            <View style={styles.centerInRow}>
              <MaterialCommunityIcons name="circle-medium" size={24} color="#2563eb" style={{marginHorizontal: -4}} />
              <Text style={styles.secondaryText}>{repository.language}</Text>
            </View>
            ) : <View></View>}
          {repository.updatedAt ? (
            <Text style={styles.secondaryText}>{getRelativeTime(repository.updatedAt)}</Text>
          ) : ''}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc'
  },

  repositoryAvatar: {
    width: 48,
    height: 48,
    borderRadius: 5,
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