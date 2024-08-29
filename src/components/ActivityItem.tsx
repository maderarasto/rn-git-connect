import { StyleSheet, Text, View } from 'react-native'
import { FontAwesome5, Octicons } from '@expo/vector-icons';
import { ActivityEvent } from '@src/types';
import { capitalize, getRelativeTime } from '@src/utils';

export type ActivityItemProps = {
  event: ActivityEvent
  last?: boolean
}

const ActivityItem = ({
  event,
  last = false,
}: ActivityItemProps) => {
  function resolveIcon() {
    let icon = <Octicons name="issue-opened" size={18} color="#e5e7eb" />
    
    if (event.type === 'PushEvent') {
      icon = <Octicons name="git-commit" size={18} color="#e5e7eb" />
    } else if (event.type === 'IssuesEvent' && event.payload.issue?.state === 'closed') {
      icon = <Octicons name="issue-closed" size={18} color="#e5e7eb" />
    } else if (event.type === 'IssueCommentEvent') {
      icon = <FontAwesome5 name="comment" size={18} color="#e5e7eb" />
    } else if (event.type === 'MergeRequestEvent') {
      icon = <Octicons name="git-pull-request" size={18} color="#e5e7eb" />
    }

    return icon;
  }

  function resolveTitle() {
    let title = '';
    
    if (event.type === 'IssuesEvent' && event.payload.issue) {
      title = event.payload.issue.state === 'closed' ? 'Closed' : 'Opened';
      title += ` issue #${event.payload.issue.number} "${event.payload.issue.title}"`;
      title += ` at ${event.repo?.name}`
    } else if (event.type === 'MergeRequestEvent' && event.payload.mergeRequest) {
      title = event.payload.mergeRequest.state === 'closed' ? 'Closed' : 'Opened';
      title += ` merge request !${event.payload.mergeRequest.number} "${event.payload.mergeRequest.title}"`;
      title += ` at ${event.repo.name}`;
    } else if (event.type === 'IssueCommentEvent' && event.payload.issue) {
      title = `Commented on issue #${event.payload.issue.number} "${event.payload.issue.title}" at ${event.repo?.name}`
    } else if (event.type === 'PushEvent') {
      title = `Pushed ${event.payload.commitCount} commits at ${event.repo?.name}`
    } else if (event.type === 'CreateEvent'  && event.repo) {
      title = `Created a ${event.payload.targetType} `;

      if (event.payload.targetType === 'branch') {
        title += `${event.payload.targetName} in ${event.repo.name}`;
      } else if (event.payload.targetType === 'repository') {
        title += event.repo.name;
      } 
    } 

    return title;
  }

  function resolveBody() {
    let body = '';

    if (event.type === 'IssueCommentEvent' && event.payload.comment) {
      body = event.payload.comment.body ?? '';
    }

    return body;
  }

  return (
    <View style={styles.container}>
      <View style={{ position: 'relative' }}>
        {!last ? <View style={styles.line}></View> : '' }
        <View style={{ padding: 4, borderRadius: 50, backgroundColor: '#6b7280'}}>
          {resolveIcon()}
        </View>
      </View>
      <View style={{ flex: 1, marginBottom: 12 }}>
        <Text style={{ fontSize: 16, }}>{resolveTitle()}</Text>
        {event.type === 'PushEvent' ? (
          <Text style={{ color: '#333' }}>{event.payload.head?.substring(0, 8)} · {event.payload.commitTitle}</Text>
        ) : '' }
        {resolveBody() ? (
          <Text style={{ color: '#333' }}>{resolveBody()}</Text>
        ) : '' }
        <Text style={{ alignSelf: 'flex-end', color: '#6b7280'}}>{getRelativeTime(event.createdAt)}</Text>
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