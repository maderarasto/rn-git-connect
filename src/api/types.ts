export type AccountType = (
  | 'Github'
  | 'Gitlab'
);

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

export type SimpleMergeRequest = Pick<MergeRequest, (
  | 'id'
  | 'number'
  | 'title'
  | 'state'
)>;

export type Issue = {
  id: number
  number: number
  title: string
  body: string|null
  labels: Label[]
  state?: string
  commentCount: number
  user: SimpleUser|null
  createdAt: string
  updatedAt: string
  closedAt: string|null
}

export type SimpleIssue = Pick<Issue, (
  | 'id'
  | 'number'
  | 'title'
  | 'state'
)>

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

export type SimpleIssueComment = Pick<IssueComment, (
  | 'id'
  | 'body'
  | 'user'
  | 'createdAt'
  | 'updatedAt'
)>

export type Milestone = {
  id: number
  title: string
  state: string
}

export type SimpleMilestone = Pick<Milestone, (
  | 'id'
  | 'title'
  | 'state'
)>

export type WikiPage = {
  format: string
  slug: string
  title: string
}

export type SimplelWikiPage = Pick<WikiPage, (
  | 'format'
  | 'slug'
  | 'title'
)>

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
  | 'UpdateEvent'
  | 'DeleteEvent'
  | 'ForkEvent'
  | 'IssueCommentEvent'
  | 'IssuesEvent'
  | 'MergeRequestEvent'
  | 'MilestoneEvent'
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
  issue: SimpleIssue
  comment: SimpleIssueComment
  mergeRequest: SimpleMergeRequest
  milestone: SimpleMilestone
  wiki: WikiPage
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