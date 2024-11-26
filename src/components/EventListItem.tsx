
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome5, Octicons } from '@expo/vector-icons';
import { Event } from '@src/api/types';
import TextBold from './TextBold';
import React from 'react';
import { getRelativeTime } from '@src/utils/functions';

export type EventListItemProps = {
  event: Event
  last?: boolean
}

const EventListItem = ({
  event,
  last = false,
}: EventListItemProps) => {
  const resolveIcon = () => {
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

  const resolveBranchName = (targetName: string|null) => {
    let branchName = targetName;

    if (!targetName) {
      branchName = 'main';
    }

    if (targetName?.includes('refs/heads/')) {
      branchName = targetName.replace('refs/heads/', '');
    }

    return branchName;
  }

  const getIssueTitle = () => {
    const issueStateText = event.payload.issue?.state === 'closed' ? 'Closed' : 'Opened';
    const issueTitleText = `#${event.payload.issue?.number} "${event.payload.issue?.title}"`;

    return (
      <Text style={{ fontSize: 16 }}>
        {issueStateText} issue <TextBold>{issueTitleText}</TextBold> at <TextBold>{event.repo?.name}</TextBold>
      </Text>
    );
  }

  const getMergeRequestTitle = () => {
    const mergeRequestStateText = event.payload.mergeRequest?.state === 'closed' ? 'Closed' : 'Opened';
    const mergeRequestTitleText = `#${event.payload.mergeRequest?.number} "${event.payload.mergeRequest?.title}"`;

    return (
      <Text style={{ fontSize: 16 }}>
        {mergeRequestStateText} merge request <TextBold>{mergeRequestTitleText}</TextBold> at <TextBold>{event.repo?.name}</TextBold>
      </Text>
    );
  }

  const getIssueCommentTitle = () => {
    const issueTitleText = `#${event.payload.issue?.number} "${event.payload.issue?.title}"`;

    return (
      <Text style={{ fontSize: 16 }}>
        Commented on issue <TextBold>{issueTitleText}</TextBold> at <TextBold>{event.repo?.name}</TextBold>
      </Text>
    );
  }

  const getPushEventTitle = () => {
    const branchName = resolveBranchName(event.payload.targetName ?? '');

    return (
      <Text style={{ fontSize: 16 }}>
        Pushed {event.payload.push?.commitCount ?? 0} commit(s) to branch <TextBold>{branchName}</TextBold> at <TextBold>{event.repo?.name}</TextBold>
      </Text>
    );
  }

  const getCreateBranchTitle = () => {
    return (
      <Text style={{ fontSize: 16 }}>
        Created a branch in <TextBold>{event.repo?.name}</TextBold>
      </Text>
    );
  }

  const getCreateRepositoryTitle = () => {
    return (
      <Text style={{ fontSize: 16 }}>
        Created a repository <TextBold>{event.repo?.name}</TextBold>
      </Text>
    );
  }

  const resolveTitle = () => {
    let title: React.JSX.Element|string = '';
    
    if (event.type === 'IssuesEvent' && event.payload.issue) {
      title = getIssueTitle();
    } else if (event.type === 'MergeRequestEvent' && event.payload.mergeRequest) {
      title = getMergeRequestTitle();
    } else if (event.type === 'IssueCommentEvent' && event.payload.issue) {
      title = getIssueCommentTitle();
    } else if (event.type === 'PushEvent') {
      title = getPushEventTitle();
    } else if (event.type === 'CreateEvent' && event.repo) {
      if (event.payload.targetType === 'branch') {
        title = getCreateBranchTitle();
      } else if (event.payload.targetType === 'repository') {
        title = getCreateRepositoryTitle();
      }
    }

    return title;
  }

  function resolveBody() {
    let children: React.JSX.Element|string = '';

    if (event.type === 'PushEvent') {
      children = (
        <>
          <TextBold>{event.payload?.push?.head?.substring(0, 8)}</TextBold>  · {event.payload.push?.commitTitle}
        </>
      )
    } else if (event.type === 'IssueCommentEvent' && event.payload.comment) {
      children = event.payload.comment.body ?? '';
    }

    return children ? (<Text style={{ marginBottom: 4, color: '#333' }}>{children}</Text>) : '';
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
        {resolveTitle()}
        {resolveBody()}
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

export default EventListItem