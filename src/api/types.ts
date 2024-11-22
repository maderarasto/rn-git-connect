export type AccountType = (
  | 'Github'
  | 'Gitlab'
);

export type ApiAdapter = {
  getUser: (user: any) => User
  // toApiUser: (user: User) => any
};

export type User = {
  id: number
  service: AccountType,
  username?: string
  fullname: string
  avatarUrl: string
  webUrl: string
  company: string
  location: string
  email: string
  bio: string
  followers: number
  following: number
  createdAt: string
}

export type Repository = {
  id: number
  name: string
  fullname: string,
  path: string
  fullpath: string
  owner: User
  description: string
  language: string
  createdAt: string
  updatedAt: string
  avatarUrl: string
  gitUrl: string
  sshUrl: string
  cloneUrl: string
  hasIssues: boolean
  hasWiki: boolean
  hasPages: boolean
  hasDiscussions: boolean
  topics: string[]
  visibility: string
  forks: number
  openIssues: number
  watchers: number
  defaultBranch: string
}

export type MergeRequest = {
  id: number
  nodeId: string
  number: number
  asignee: User
  asignees: User[]
  autoMerge: boolean
  body?: string
  changedFiles: number
  commentCount: number
  commentsUrl: string
  commitCount: number
  commitsUrl: string
  deletions: number
  draft: boolean
  diffUrl: string
  issueUrl: string
  labels: Label[]
  locked: boolean
  merged: boolean
  mergedAt?: string
  mergedBy?: any
  rebaseable: boolean
  requestedReviewers: User[]
  requestedTeams: any[]
  reviewCommentUrl: string
  reviewCommentCount: number
  reviewCommentsUrl: string
  state: string
  title: string
  user: User
  createdAt: string
  updatedAt?: string
  closedAt?: string
}

export type Issue = {
  id: number
  number: number
  title: string
  body?: string
  labels: Label[]
  state: string
  commentCount: number
  user: User
  createdAt: string
  updatedAt: string
  closedAt: string|null
}

export type IssueComment = {
  id: number
  nodeId: string
  body?: string
  user: User
  url: string
  htmlUrl: string
  issueUrl: string
  createdAt: string
  updatedAt: string
}

export type Event = {
  id: number
  type: EventType
  author: User
  repo?: Repository
  payload: EventPayload
  createdAt: string
}

export type EventType = (
  | 'CreateEvent'
  | 'DeleteEvent'
  | 'ForkEvent'
  | 'IssueCommentEvent'
  | 'IssuesEvent'
  | 'MergeRequestEvent'
  | 'PushEvent'
);

export type EventPayload = {
  repoId: number
  commitCount: number
  commitTitle: string
  head: string
  issue: Issue
  comment: IssueComment
  mergeRequest: MergeRequest
  targetType: string
  targetName: string
}

export type Label = {
  id: number
    name: string
    description: string
    color: string
}