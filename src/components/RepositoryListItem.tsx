import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Repository } from '@src/types'
import { convertToSlug } from '@src/utils'

export type RepositoryListItemProps = {
  repository: Repository
}

const RepositoryListItem = ({
  repository
}: RepositoryListItemProps) => {
  function resolveDate(dateString?: string) {
    if (!dateString) {
      return '';
    }

    return dateString;
  }

  return (
    <View style={styles.container}>
      <View style={{ width: 48, height: 48, borderRadius: 5, backgroundColor: '#ccc'}}></View>
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.repositoryTitle}>{repository.name}</Text>
          <Text style={styles.repositoryDescription}>{repository.description}</Text>
        </View>
        <View style={styles.repositoryTagContainer}>
          {repository.topics?.map((repo, index) => (
            <Text 
              key={`tag[${index}]:${convertToSlug(repo)}`}
              style={styles.repositoryTag}>
                {repo}
              </Text>
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={styles.repositoryTag}></Text>
          <Relativ style={{fontSize: 12, color: '#808080'}}>{resolveDate(repository.updatedAt)}</Relativ>
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

  }
})

export default RepositoryListItem