import { View, Text, TouchableOpacity, StyleSheet} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import AvatarImage from "@src/components/AvatarImage";
import {getRelativeTime} from "@src/utils/functions";
import {slug} from "@src/utils/strings";
import {Repository} from "@src/api/types";
import {getColorFromPalette} from "@src/utils/colors";

export type RepositoryListItemProps = {
  repository: Repository
}

const RepositoryListItem = ({
  repository
}: RepositoryListItemProps) => {
  return (
    <TouchableOpacity style={styles.container}>
      <AvatarImage
        imageUrl={repository.avatarUrl}
        letterFrom={repository.name}
        backgroundColor={getColorFromPalette({ type: 'modulo', value: repository.name.length})}/>
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.repositoryTitle}>{repository.fullName}</Text>
          {repository.description ? (
            <Text style={styles.repositoryDescription}>{repository.description}</Text>
          ) : ''}
        </View>
        {repository.topics?.length ? (
          <View style={styles.repositoryTagContainer}>
            {repository.topics?.map((repo, index) => (
              <Text
                key={`tag[${index}]:${slug(repo)}`}
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
    paddingHorizontal: 16,
    paddingVertical: 20,
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
