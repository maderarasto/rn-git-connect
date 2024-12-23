export type User = {
  id: number
  login?: string // Accessible for authenticated user
  name: string|null
  avatar_url: string
  url: string
  company: string|null
  location: string|null
  email: string|null
  bio: string|null
  followers: number
  following: number
  created_at: string

  // Other properties
  [key: string]: any
};

export type SimpleUser = Pick<User, (
  | 'id'
  | 'login'
  | 'avatar_url'
  | 'url'
)>;

export type Actor = Pick<User, (
  | 'id'
  | 'login'
  | 'avatar_url'
  | 'url'
)>;

export type RepositoryLicense = {
  key: string
  name: string
  url: string|null
  spdx_id: string|null
  node_id: string
  html_url?: string
}

export type RepositoryLink = {
  href: string
}

export type Repository = {
  id: number
  name: string
  full_name: string
  owner: SimpleUser
  description: string|null
  url: string
  created_at: string
  updated_at: string
  pushed_at: string|null
  git_url: string
  ssh_url: string
  clone_url: string
  language: string|null
  has_issues: boolean
  has_wiki: boolean
  has_pages: boolean
  has_discussions: boolean
  topics: string[]
  visibility: 'public' | 'private'
  forks: number
  open_issues: number
  watchers: number
  default_branch: string

  // Other properties
  [key: string]: any
};

export type SimpleRepository = Pick<Repository, (
  | 'id'
  | 'name'
  | 'url'
)>;

export type Branch = {
  label: string
  ref: string
  sha: string
  user: SimpleUser
  repo: Repository
}

export type Commit = {
  sha: string
  author: Pick<User, 'email' | 'name'>
  message: string
  distinct: boolean
  url: string
}

export type Label = {
  id: number
  node_id: string
  url: string
  name: string
  color: string|null
  default: boolean
  description: string|null
}

export type Milestone = {
  url: string
  html_url: string
  labels_url: string
  id: number
  node_id: string
  number: number
  state: 'open' | 'closed'
  title: string
  description: string|null
  creator: SimpleUser|null
  open_issues: number
  closed_issues: number
  created_at: string
  updated_at: string
  closed_at: string|null
  due_on: string|null
}

export type Reactions = {
  url: string
  total_count: number
  '+1': number
  '-1': number
  laugh: number
  confused: number
  heart: number
  hooray: number
  eyes: number
  rocket: number
}

export type AuthorAssociation = (
  | 'COLLABORATOR'
  | 'CONTRIBUTOR'
  | 'FIRST_TIMER'
  | 'FIRST_TIME_CONTRIBUTOR'
  | 'MANNEQUIN'
  | 'MEMBER'
  | 'NONE'
  | 'OWNER'
)

export type Issue = {
  id: number
  number: number
  title: string
  body: string|null
  assignee: SimpleUser|null
  assignees: SimpleUser[]
  labels: Label[]
  state: 'open' | 'closed'
  comments: number
  user: SimpleUser|null
  issue_url: string
  created_at: string
  updated_at: string
  closed_at: string|null

  // Other properties
  [key: string]: any
}

export type SimpleIssue = Pick<Issue, (
  | 'id'
  | 'number'
  | 'title'
  | 'state'
)>

export type IssueComment = {
  id: number
  body: string|null
  user: SimpleUser
  url: string|null
  html_url: string
  issue_url: string
  created_at: string
  updated_at: string

  // Other properties
  [key: string]: any
}

export type SimpleIssueComment = Pick<IssueComment, (
  | 'id'
  | 'body'
  | 'user'
  | 'created_at'
  | 'updated_at'
)>

export type PullRequest = Issue & {
  commits: number
  commits_url: string
  diff_url: string
  additions: number
  deletions: number
  changed_files: number
  review_comment_url: string
  review_comments_url: string
  review_comments: number
  merged: boolean
  merged_at: string|null
  merged_by: unknown|null
  closed_at: string|null
  draft: boolean
  locked: boolean
}

export type PushEventPayload = {
  type: 'PushEvent'
  repository_id: number
  push_id: number
  size: number
  distinct_size: number
  ref: string
  head: string
  before: string
  commits: Commit[]
}

export type CreateEventPayload = {
  type: 'CreateEvent'
  ref: string
  ref_type: 'branch' | 'repository'
  master_branch: string
  description: string|null
  pusher_type: string
}

export type DeleteEventPayload = {
  type: 'DeleteEvent'
  ref: string
  ref_type: 'branch' | 'repository'
  master_branch: string
  description: string|null
  pusher_type: string
}

export type IssuesEventPayload = {
  type: 'IssuesEvent'
  action: 'opened' | 'reopened' | 'closed' | 'created'
  issue?: Issue
  comment?: IssueComment
  pull_request?: PullRequest
}

export type EventType = (
  | 'PushEvent'
  | 'CreateEvent'
  | 'DeleteEvent'
  | 'PullRequestEvent'
  | 'IssuesEvent'
  | 'IssueCommentEvent'
  | 'WatchEvent'
  )

export type Event = {
  id: number
  type: EventType|null
  actor: Actor
  repo: SimpleRepository
  org?: Actor
  payload: PushEventPayload | IssuesEventPayload | CreateEventPayload | DeleteEventPayload
  public: boolean
  created_at: string
}

//--------------------------------------------------------\\
//                     QUERY PARAMETERS                   \\
//--------------------------------------------------------\\

export type ListQuery = {
  page: number
  per_page: number
}