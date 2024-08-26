import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

export type ActivityItemProps = {
  last?: boolean
}

const ActivityItem = ({
  last = false,
}: ActivityItemProps) => {
  return (
    <View style={styles.container}>
      <View style={{ position: 'relative' }}>
        {!last ? <View style={styles.line}></View> : '' }
        <View style={{ padding: 2, borderRadius: 50, backgroundColor: '#9ca3af'}}>
          <Ionicons name="git-commit-outline" size={18} color="#e5e7eb" />
        </View>
      </View>
      <View style={{ flex: 1, marginBottom: 8 }}>
        <Text style={{ fontSize: 16, }}>Pushed to branch user-profile at Rastislav Madera / Git Connect</Text>
        <Text style={{ color: '#333' }}>a4eb09b6 · Adds a basic layout for user profile screen. </Text>
        <Text style={{ alignSelf: 'flex-end', color: '#6b7280'}}>23 hours ago</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    gap: 8
  },

  line: {
    position: 'absolute', 
    left: '45%',
    width: 1.5, 
    height: '100%', 
    backgroundColor: '#9ca3af',
  }
});

export default ActivityItem