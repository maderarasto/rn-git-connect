export type User = {
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string|null
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string|null
  company: string|null
  blog: string|null
  location: string|null
  email: string|null
  notification_email: string|null
  hireable: boolean|null
  bio: string|null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
  login?: string
  number?: string
  twitter_username?: string
  private_gists?: number
  total_private_repos?: number
  owned_private_repos?: number
  disk_usage?: number
  collaborators?: number
  two_factor_authentication?: boolean
  plan?: {
    name: string
    space: number
    private_repos: number
    collaborators: number
  }
  business_plus?: boolean
  ldap_dn?: string
};

export type SimpleUser = Pick<User, (
  | 'login'
  | 'id'
  | 'node_id'
  | 'avatar_url'
  | 'gravatar_id'
  | 'url'
  | 'html_url'
  | 'followers_url'
  | 'following_url'
  | 'gists_url'
  | 'starred_url'
  | 'subscriptions_url'
  | 'organizations_url'
  | 'repos_url'
  | 'events_url'
  | 'received_events_url'
  | 'type'
  | 'site_admin'
)>

export type Actor = Pick<User, (
  | 'id'
  | 'login'
  | 'gravatar_id'
  | 'url'
  | 'avatar_url'
)>

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
  node_id: string
  name: string
  full_name: string
  private: boolean
  owner: SimpleUser
  html_url: string
  description: string|null
  fork: boolean
  url: string
  forks_url: string
  keys_url: string
  collaborators_url: string
  teams_url: string
  hooks_url: string
  issue_events_url: string
  events_url: string
  assignees_url: string
  branches_url: string
  tags_url: string
  blobs_url: string
  git_tags_url: string
  git_refs_url: string
  trees_url: string
  statuses_url: string
  languages_url: string
  stargazers_url: string
  contributors_url: string
  subscribers_url: string
  subscription_url: string
  commits_url: string
  git_commits_url: string
  comments_url: string
  issue_comment_url: string
  contents_url: string
  compare_url: string
  merges_url: string
  archive_url: string
  downloads_url: string
  issues_url: string
  pulls_url: string
  milestones_url: string
  notifications_url: string
  labels_url: string
  releases_url: string
  deployments_url: string
  created_at: string
  updated_at: string
  pushed_at: string|null
  git_url: string
  ssh_url: string
  clone_url: string
  svn_url: string
  homepage: string|null
  size: number
  stargazers_count: number
  watchers_count: number
  language: string|null
  has_issues: boolean
  has_projects: boolean
  has_downloads: boolean
  has_wiki: boolean
  has_pages: boolean
  has_discussions: boolean
  forks_count: number
  mirror_url: string|null
  archived: boolean
  disabled: boolean
  open_issues_count: number
  license: RepositoryLicense|null
  allow_forking: boolean
  is_template: boolean
  web_commit_signoff_required: boolean
  topics: string[]
  visibility: 'public' | 'private'
  forks: number
  open_issues: number
  watchers: number
  default_branch: string
}

export type SimpleRepository = Pick<Repository, 'id' | 'name' | 'url'>

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
  url: string
  repository_url: string
  labels_url: string
  comments_url: string
  events_url: string
  html_url: string
  id: number
  node_id: string
  number: number
  title: string
  user: SimpleUser
  labels: Label[]
  state: 'open' | 'closed'
  locked: boolean
  assignee: SimpleUser|null
  assignees: SimpleUser[]
  milestone: Milestone|null
  comments: number
  created_at: string
  updated_at: string
  closed_at: string|null
  author_association: AuthorAssociation
  active_lock_reason: string|null
  body: string|null
  reactions: Reactions
  timeline_url: string
  performed_via_github_app: unknown
  state_reason: 'completed' | 'reopened' | 'not_planned' | null
}

export type IssueComment = {
  url: string
  html_url: string
  issue_url: string
  id: number
  node_id: string
  user: SimpleUser
  created_at: string
  updated_at: string
  author_association: AuthorAssociation
  body: string|null
  reactions: Reactions
  performed_via_github_app: unknown
}

export type PullRequest = {
  url: string|null
  id: number
  node_id: string
  html_url: string|null
  diff_url: string|null
  patch_url: string|null
  issue_url: string
  number: number
  state: 'open' | 'closed'
  locked: boolean
  title: string
  user: SimpleUser
  body: string|null
  created_at: string
  updated_at: string
  closed_at: string|null
  merged_at: string|null
  merge_commit_sha: string|null
  assignee: SimpleUser|null
  assignees: SimpleUser[]
  requested_reviewers: SimpleUser[]
  requested_teams: unknown[] // TODO: replace unknown with its specific type
  labels: Label[]
  milestone: Milestone|null
  draft: boolean
  commits_url: string
  review_comments_url: string
  review_comment_url: string
  comments_url: string
  statuses_url: string
  head: Branch
  base: Branch
  _links: Record<string, RepositoryLink>
  author_association: AuthorAssociation
  auto_merge: boolean
  active_lock_reason: unknown
  merged: boolean
  mergeable: boolean
  rebaseable: boolean
  mergeable_state: string
  merged_by: unknown
  comments: number
  review_comments: number
  mainteiner_can_modify: boolean
  commits: number
  additions: number
  deletions: number
  changed_files: number
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
  created_at: string|null
}

//--------------------------------------------------------\\
//                     QUERY PARAMETERS                   \\
//--------------------------------------------------------\\

export type ListQuery = {
  page: number
  per_page: number
}