export type AccountType = (
  | 'Github'
  | 'Gitlab'
);

export type User = {
  id: number
  service: AccountType,
  username?: string
  name: string|null
  avatarUrl: string
  url: string
  company: string|null
  location: string|null
  blog: string|null
  email: string|null
  bio: string|null
  followers: number
  following: number
  createdAt: Date
}

export type EditableUser = Pick<User, (
  | 'name'
  | 'bio'
  | 'company'
  | 'location'
  | 'blog'
)>

export type SimpleUser = Pick<User, (
  | 'id'
  | 'username'
  | 'url'
  | 'avatarUrl'
)>;

export type Repository = {
  id: number
  name: string
  fullName: string,
  path: string
  fullPath: string
  description: string|null
  language: string|null
  topics: string[]
  owner: SimpleUser|null
  visibility: string
  forks: number
  openIssues: number
  watchers: number
  defaultBranch: string
  url: string
  avatarUrl?: string
  hasIssues: boolean
  hasWiki: boolean
  hasPages?: boolean
  hasDiscussions?: boolean
  createdAt: Date
  updatedAt: Date
}

export type SimpleRepository = Pick<Repository, (
  | 'id'
  | 'name'
  | 'url'
)>

export type Issue = {
  id: number
  number: number
  title: string
  body: string|null
  labels: Label[]
  state?: string
  assignee: SimpleUser|null
  assignees: SimpleUser[]
  user: SimpleUser|null
  commentCount: number
  createdAt: Date
  updatedAt: Date
  closedAt: Date|null
}

export type SimpleIssue = Pick<Issue, (
  | 'id'
  | 'number'
  | 'title'
  | 'state'
  )>

export type MergeRequest = Issue & {
  commitCount: number
  changedFiles: number
  additions: number
  deletions: number
  draft: boolean
  diffUrl: string|null
  issueUrl: string
  reviewCommentUrl: string
  reviewCommentCount: number
  reviewCommentsUrl: string
  merged: boolean
  mergedAt: Date|null
  mergedBy: unknown|null
}

export type SimpleMergeRequest = Pick<MergeRequest, (
  | 'id'
  | 'number'
  | 'title'
  | 'state'
)>;

export type IssueComment = {
  id: number
  body: string|null
  user: SimpleUser
  url: string|null
  htmlUrl: string
  issueUrl: string
  createdAt: Date
  updatedAt: Date
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

export type SimpleWikiPage = Pick<WikiPage, (
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
  createdAt: Date
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
  | 'WatchEvent'
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

export type ListParams = Partial<{
  page: number
  perPage: number
}>

export type SearchReposParams = ListParams & Partial<{
  owner: string
  searchText: string
  language: string
}>;

