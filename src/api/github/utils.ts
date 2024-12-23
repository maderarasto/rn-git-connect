import {
  Repository,
  SimpleIssue,
  SimpleRepository,
  SimpleMergeRequest,
  SimpleUser,
  User,
  Label,
  ListQuery,
  EventType,
  EventPayload,
  PushData,
  IssueComment,
  SimpleIssueComment,
  Event,
  Issue,
  MergeRequest
} from '@src/api/types';
import {
  User as GithubUser,
  SimpleUser as GithubSimpleUser,
  Repository as GithubRepository,
  SimpleRepository as GithubSimpleRepository,
  Issue as GithubIssue,
  SimpleIssue as GithubSimpleIssue,
  IssueComment as GithubIssueComment,
  SimpleIssueComment as GithubSimpleIssueComment,
  PullRequest as GithubPullRequest,
  Label as GithubLabel,
  ListQuery as GithubListQuery,
  EventType as GithubEventType,
  Event as GithubEvent,
  PushEventPayload,
  IssuesEventPayload,
  CreateEventPayload,
  DeleteEventPayload
} from '@src/api/github/types';

type GithubEventPayload = (
  | PushEventPayload
  | IssuesEventPayload
  | CreateEventPayload
  | DeleteEventPayload
);

function resolveEventType(eventType: string): EventType {
  let resolvedType: EventType = eventType as EventType

  if (eventType === 'PullRequestEvent') {
    resolvedType = 'MergeRequestEvent';
  }

  return resolvedType;
}

function resolveEventPayload(eventType: string, payload: GithubEventPayload): EventPayload {
  const resolvedType: GithubEventType = eventType as GithubEventType;

  if (resolvedType === 'CreateEvent') {
    payload.type = 'CreateEvent';
  } else if (resolvedType === 'DeleteEvent') {
    payload.type = 'DeleteEvent';
  } else if (resolvedType === 'PushEvent') {
    payload.type = 'PushEvent'
  } else {
    payload.type = 'IssuesEvent';
  }

  const resolvedPayload: EventPayload = {
    targetType: payload.type === 'CreateEvent' || payload.type === 'DeleteEvent' ? payload.ref_type : null,
    targetName: payload.type === 'PushEvent' || payload.type === 'CreateEvent' || payload.type === 'DeleteEvent'
      ? payload.ref : null,
  };

  if (payload.type === 'PushEvent') {
    const pushData: Partial<PushData> = {
      repoId: payload.repository_id,
      head: payload.head,
      commitCount: payload.commits.length,
    };

    if (payload.commits.length > 0) {
      pushData.commitTitle = payload.commits[0].message;
    }

    resolvedPayload.push = pushData as PushData;
  } else if (payload.type === 'IssuesEvent') {
    if (payload.issue) {
      resolvedPayload.issue = deserializeSimpleIssue(payload.issue);
    }

    if (payload.comment) {
      resolvedPayload.comment = deserializeSimpleIssueComment(payload.comment);
    }

    if (payload.pull_request) {
      resolvedPayload.mergeRequest = deserializeSimpleMergeRequest(payload.pull_request);
    }
  }

  return resolvedPayload;
}

export function deserializeUser(user: GithubUser): User {
  return {
    id: user.id,
    service: 'Github',
    username: user.login,
    name: user.name,
    avatarUrl: user.avatar_url,
    url: user.blog,
    company: user.company,
    location: user.location,
    email: user.email,
    bio: user.bio,
    followers: user.followers,
    following: user.following,
    createdAt: new Date(user.created_at)
  };
}

export function deserializeSimpleUser(user: GithubUser|GithubSimpleUser): SimpleUser {
  return {
    id: user.id,
    username: user.login,
    avatarUrl: user.avatar_url,
    url: user.url,
  };
}

export function deserializeRepository(repo: GithubRepository): Repository {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    path: repo.name,
    fullPath: repo.full_name,
    description: repo.description,
    language: repo.language,
    topics: repo.topics,
    owner: deserializeSimpleUser(repo.owner),
    visibility: repo.visibility,
    forks: repo.forks,
    openIssues: repo.open_issues,
    watchers: repo.watchers,
    defaultBranch: repo.default_branch,
    url: repo.url,
    hasIssues: repo.has_issues,
    hasWiki: repo.has_wiki,
    hasPages: repo.has_pages,
    hasDiscussions: repo.has_discussions,
    createdAt: new Date(repo.created_at),
    updatedAt: new Date(repo.updated_at),
  };
}

export function deserializeSimpleRepository(
  repo: GithubRepository | GithubSimpleRepository
): SimpleRepository {
  return { id: repo.id, name: repo.name, url: repo.url };
}

export function deserializeIssue(issue: GithubIssue): Issue {
  return {
    id: issue.id,
    number: issue.number,
    title: issue.title,
    body: issue.body,
    labels: issue.labels,
    state: issue.state,
    assignee: issue.assignee ? deserializeSimpleUser(issue.assignee) : null,
    assignees: issue.assignees.map((assignee) => {
      return deserializeSimpleUser(assignee)
    }),
    user: issue.user ? deserializeSimpleUser(issue.user) : null,
    commentCount: issue.comments,
    createdAt: new Date(issue.created_at),
    updatedAt: new Date(issue.updated_at),
    closedAt: issue.closed_at ? new Date(issue.closed_at) : null
  };
}

export function deserializeSimpleIssue(
  issue: GithubIssue | GithubSimpleIssue
): SimpleIssue {
  return {
    id: issue.id,
    number: issue.number,
    title: issue.title,
    state: issue.state
  };
}

export function deserializeIssueComment(
  comment: GithubIssueComment
): IssueComment {
  return {
    id: comment.id,
    body: comment.body,
    user: deserializeSimpleUser(comment.user),
    url: comment.url,
    htmlUrl: comment.html_url,
    issueUrl: comment.issue_url,
    createdAt: new Date(comment.created_at),
    updatedAt: new Date(comment.updated_at),
  };
}

export function deserializeSimpleIssueComment(
  comment: GithubIssueComment | GithubSimpleIssueComment
): SimpleIssueComment {
  return {
    id: comment.id,
    body: comment.body,
    user: deserializeSimpleUser(comment.user),
    createdAt: new Date(comment.created_at),
    updatedAt: new Date(comment.updated_at),
  }
}

export function deserializeMergeRequest(
  pullRequest: GithubPullRequest
) : MergeRequest {
  return {
    ...deserializeIssue(pullRequest),
    commitCount: pullRequest.commits,
    changedFiles: pullRequest.changed_files,
    additions: pullRequest.additions,
    deletions: pullRequest.deletions,
    diffUrl: pullRequest.diff_url,
    issueUrl: pullRequest.issue_url,
    reviewCommentUrl: pullRequest.review_comment_url,
    reviewCommentsUrl: pullRequest.review_comments_url,
    reviewCommentCount: pullRequest.review_comments,
    draft: pullRequest.draft,
    merged: pullRequest.merged,
    mergedAt: pullRequest.merged_at ? new Date(pullRequest.merged_at) : null,
    mergedBy: pullRequest.merged_by,
  };
}

export function deserializeSimpleMergeRequest(
  pullRequest: GithubPullRequest,
): SimpleMergeRequest {
  return {
    id: pullRequest.id,
    number: pullRequest.number,
    title: pullRequest.title,
    state: pullRequest.state,
  };
}

export function deserializeEvent(event: GithubEvent): Event {
  return {
    id: event.id,
    type: resolveEventType(event.type ?? ''),
    user: deserializeSimpleUser(event.actor),
    repo: deserializeSimpleRepository(event.repo),
    payload: resolveEventPayload(event.type ?? '', event.payload),
    createdAt: new Date(event.created_at),
  }
}

export function deserializeLabel(label: GithubLabel): Label {
  return {
    id: label.id,
    name: label.name,
    description: label.description,
    color: label.color
  };
}

export function serializeListQuery(params: ListQuery): GithubListQuery {
  return {
    page: params.page ?? 1,
    per_page: params.perPage ?? 10,
  };
}