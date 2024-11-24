export type AccountType = (
  | 'Github'
  | 'Gitlab'
);

export type ApiAdapter = {
  getUser: (user: any) => User
  getSimpleUser: (user: any) => SimpleUser
  getSimpleRepository: (repo: any) => SimpleRepository
  getLabel: (label: any) => Label
  getIssue: (issue: any) => Issue
  getIssueComment: (comment: any) => IssueComment
  getMergeRequest: (mergeRequest: any) => MergeRequest
  getEventType: (eventType: string) => EventType
  getEventPayload: (eventType: string, payload: any) => EventPayload
  getEvent: (event: any) => Event
  getApiListQuery: (query: ListQuery) => Record<string, any>
  // toApiUser: (user: User) => any
};

export type User = {
  id: number
  service: AccountType,
  username?: string
  fullname: string|null
  avatarUrl: string
  webUrl: string
  company: string|null
  location: string|null
  email: string|null
  bio: string|null
  followers: number
  following: number
  createdAt: string
}

export type SimpleUser = Pick<User, (
  | 'id'
  | 'username'
  | 'webUrl'
  | 'avatarUrl'
)>;

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
  url: string
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

export type SimpleRepository = Pick<Repository, (
  | 'id'
  | 'name'
  | 'url'
)>

export type MergeRequest = {
  id: number
  // nodeId: string
  number: number
  assignee: SimpleUser|null
  assignees: SimpleUser[]
  autoMerge: boolean
  body: string|null
  changedFiles: number
  commentCount: number
  commentsUrl: string
  commitCount: number
  commitsUrl: string
  deletions: number
  draft: boolean
  diffUrl: string|null
  issueUrl: string
  labels: Label[]
  locked: boolean
  merged: boolean
  mergedAt: string|null
  mergedBy: unknown|null
  rebaseable: boolean
  requestedReviewers: SimpleUser[]
  requestedTeams: any[]
  reviewCommentUrl: string
  reviewCommentCount: number
  reviewCommentsUrl: string
  state: string
  title: string
  user: SimpleUser
  createdAt: string
  updatedAt: string
  closedAt: string|null
}

export type Issue = {
  id: number
  number: number
  title: string
  body: string|null
  labels: Label[]
  state: string
  commentCount: number
  user: SimpleUser
  createdAt: string
  updatedAt: string
  closedAt: string|null
}

export type IssueComment = {
  id: number
  // nodeId: string
  body: string|null
  user: SimpleUser
  url: string
  htmlUrl: string
  issueUrl: string
  createdAt: string
  updatedAt: string
}

export type Event = {
  id: number
  type: EventType
  user: SimpleUser
  repo?: SimpleRepository
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

export type PushData = {
  repoId: number
  commitCount: number
  commitTitle: string
  head: string
}

export type EventPayload = Partial<{
  targetType: string|null
  targetName: string|null
  push: PushData
  issue: Issue
  comment: IssueComment
  mergeRequest: MergeRequest
}>

export type Label = {
  id: number
  name: string
  description: string|null
  color: string|null
}

export type ListQuery = Partial<{
  page: number
  perPage: number
}>