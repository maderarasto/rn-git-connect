export type User = {
  id: number
  username: string
  name: string
  avatar_url: string
  web_url: string
  website_url: string|null
  organization: string|null
  location: string|null
  email?: string
  bio: string|null
  followers: number
  following: number
  created_at: string

  [key: string]: any
};

export type SimpleUser = Pick<User, (
  | 'id'
  | 'username'
  | 'name'
  | 'avatar_url'
  | 'web_url'
)>;

export type Project = {
  id: number
  name: string
  name_with_namespace: string
  path: string
  path_with_namespace: string
  description: string|null
  web_url: string
  avatar_url: string
  ssh_url_to_repo: string
  owner: SimpleUser
  topics: string[]
  visibility: string
  forks_count: number
  open_issues_count: number
  star_count: number
  default_branch: string
  issues_enabled: boolean
  wiki_enabled: boolean
  created_at: string
  updated_at: string

  [key: string]: any
}

export type SimpleProject = Pick<Project, (
  | 'id'
  | 'name'
  | 'web_url'
)>

export type Issue = {
  id: number
  iid: number|null
  project_id: number
  title: string
  description: string|null
  state: string
  type: string
  issue_type?: string
  labels: string[]
  milestone: unknown|null
  assignee: SimpleUser|null
  assignees: SimpleUser[]
  author: SimpleUser
  upvotes: number
  downvotes: number
  due_date: string|null
  created_at: string
  updated_at: string
  closed_at: string
  closed_by: unknown|null

  [key: string]: any
}

export type MergeRequest = Issue & {
  source_branch: string
  source_project_id: number
  target_branch: string
  target_project_id: number
  draft: boolean
  reviewers: SimpleUser[]
  merged_by: unknown|null
  merge_user: unknown|null
  merged_at: string|null
}

export type PushData = {
  commit_count: number
  action: string // possible values: 'pushed', 'created'
  ref_type: string // possible values: 'branch'
  commit_from: string|null
  commit_to: string|null
  ref: string
  commit_title: string
  ref_count: number|null
}

export type WikiPage = {
  format: 'org' | 'asciidoc' | 'rdoc' | 'markdown'
  slug: string
  title: string
}

export type EventAction = (
  | 'pushed to'
  | 'pushed new'
  | 'opened'
  | 'commented on'
  | 'closed'
  | 'created'
  | 'updated'
)

export type EventTargetType = (
  | 'Issue'
  | 'Note'
  | 'Milestone'
  | 'WikiPage::Meta'
  | 'MergeRequest'
)

export type EventNote = {
  id: number
  type: string|null
  body: string|null
  attachment: unknown|null
  author: SimpleUser
  noteable_id: number
  noteable_type: string // possible values: 'Issue'
  project_id: number
  noteable_iid: number
  created_at: string
  updated_at: string
}

export type Event = {
  id: number
  project_id: number
  action_name: EventAction
  target_id: number|null
  target_iid: number|null
  target_type: EventTargetType|null
  author_id: number
  target_title: string|null
  created_at: string
  author: SimpleUser
  imported: boolean
  imported_from: string
  push_data?: PushData
  note?: EventNote
  wiki_page?: WikiPage
  author_username: string
}

//--------------------------------------------------------\\
//                     QUERY PARAMETERS                   \\
//--------------------------------------------------------\\

export type ListParams = Partial<{
  page: number
  per_page: number
}>

export type ProjectListPrams = ListParams & {
  owned: boolean,
  membership: boolean
}

export type SearchProjectParams = ProjectListPrams & Partial<{
  search: string
  with_programming_language: string
}>