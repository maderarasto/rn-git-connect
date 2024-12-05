export type UserStatus = (
  | 'active'
  | 'inactive'
);

export type UserIdentity = {
  provider: string
  extern_uid: string
}

export type User = {
  id: number
  username: string
  name: string
  state: UserStatus
  locked: boolean
  avatar_url: string
  web_url: string
  created_at: string
  bio: string
  bot: boolean
  public_email: string
  skype: string
  linkedin: string
  twitter: string
  discord: string
  website_url: string
  organization: string
  job_title: string
  pronouns: string
  followers: number
  following: number
  local_time: string
  is_followed: boolean
  email?: string
  is_admin?: boolean
  last_sign_in_at?: string
  confirmed_at?: string
  theme_id?: number
  last_activity_on?: string
  color_scheme_id?: number
  projects_limit?: number
  current_sign_in_at?: string
  note?: string
  location?: string|null
  work_information?: string|null
  identities?: UserIdentity[]
  can_create_group?: boolean
  can_create_project?: boolean
  two_factor_enabled?: boolean
  external?: boolean
  private_profile?: boolean
  commit_email?: string
  current_sign_in_ip?: string
  last_sign_in_ip?: string
  plan?: string
  trial?: boolean
  sign_in_count?: number
  namespace_id?: number
  created_by?: unknown
  email_reset_offered_at?: string|null
}

export type SimpleUser = Pick<User, (
  | 'id' 
  | 'username' 
  | 'name' 
  | 'state' 
  | 'locked' 
  | 'avatar_url' 
  | 'web_url'
)>

export type Namespace = {
  id: number
  name: string
  path: string
  kind: string // possible values: 'user'
  full_path: string
  parent_id: number|null
  avatar_url: string|null
  web_url: string|null
}

export type Project = {
  id: number
  description: string|null
  name: string
  name_with_namespace: string
  path: string
  path_with_namespace: string
  created_at: string
  default_branch: string
  tag_list: unknown[]
  topics: unknown[]
  ssh_url_to_repo: string
  http_url_to_repo: string
  web_url: string
  readme_url: string
  forks_count: number
  avatar_url: string|null
  star_count: number
  last_activity_at: string|null
  namespace: Namespace
  container_registry_image_prefix: string
  _links: {
    self: string
    issues: string
    merge_requests: string
    repo_branches: string
    labels: string
    events:string
    members: string
    cluster_agents: string
  }
  packages_enabled: boolean
  empty_repo: boolean
  archived: boolean
  visibility: 'public' | 'private'
  owner: SimpleUser
  resolve_outdated_diff_discussions: boolean
  container_expiration_policy: ExpirationPolicy
  repository_object_format: string
  issues_enabled: boolean
  merge_requests_enabled: boolean
  wiki_enabled: boolean
  jobs_enabled: boolean
  snippets_enabled:boolean
  container_registry_enabled: boolean
  service_desk_enabled: boolean
  service_desk_address: string
  can_create_merge_reqiuest_in: boolean
  issues_access_level: string // possible values: 'enabled'
  repository_access_level: string // possible values: 'enabled'
  merge_requests_access_level: string // possible values: 'enabled'
  forking_access_level: string // possible values: 'enabled'
  wiki_access_level: string // possible values: 'enabled'
  builds_access_level: string // possible values: 'enabled'
  snippets_access_level: string // possible values: 'enabled'
  pages_access_level: string // possible values: 'enabled'
  analytics_access_level: string // possible values: 'enabled'
  container_registry_access_level: string // possible values: 'enabled'
  security_and_compliance_access_lebel: string /// possible values: 'private'
  releases_access_lavel: string // possible values: 'enabled'
  environment_access_level: string // possible values: 'enabled'
  feature_flags_access_level: string // possible values: 'enabled'
  infrastructure_access_level: string // possible values: 'enabled'
  monitor_access_level: string // possible values: 'enabled'
  model_experiments_access_level: string // possible values: 'enabled'
  model_registry_access_level: string // possible values: 'enabled'
  emails_disabled: boolean
  emails_enabled: boolean
  shared_runners_enabled: boolean
  lfs_enabled: boolean
  creator_id: number
  import_url: string|null
  import_type: string|null
  import_status: string
  open_issues_count: number
  description_html: string|null
  updated_at: string
  ci_default_git_depth: number
  ci_forward_Deployment_enabled: boolean
  ci_forward_deployment_rollback_allowed: boolean
  ci_job_token_scope_enabled: boolean
  ci_seperated_caches: boolean
  ci_allow_fork_pipelines_to_run_in_parent_project: boolean
  ci_id_token_sub_claim_component: string[]
  build_git_strategy: string
  keep_latest_artifact: boolean
  restrict_user_defined_variables: boolean
  ci_pipeline_variables_minimum_override_role: string
  runners_token: string
  runner_token_expiration_interval: string|null
  group_runners_enabled: boolean
  auto_cancel_pending_pipelines: string // possible values: 'enabled'
  build_timeout: number
  auto_devops_enabled: boolean
  auto_devops_deploy_strategy: string // possible values: 'continuous'
  ci_push_repository_for_job_token_allowed: boolean
  ci_config_path: string
  public_jobs: boolean
  shared_with_groups: unknown[]
  only_allow_merge_if_pipeline_succeeds: boolean
  allow_merge_on_skipped_pipeline: unknown|null
  request_access_enabled: boolean
  only_allow_merge_if_all_discussions_are_resolved: boolean
  remove_source_branch_after_merge: boolean
  printing_merge_request_link_enabled: boolean
  merge_method: string // possible values: 'merge'
  squash_option: string
  enforce_auth_checks_on_uploads: boolean
  suggestion_commit_message: unknown|null
  merge_commit_template: unknown|null
  squash_commit_template: unknown|null
  issue_branch_template: unknown|null
  warn_about_potentially_unwanted_characters: boolean
  autoclose_references_issues: boolean
  external_authorization_classification_label: string
  requirements_enabled: boolean
  requirements_access_level: string // possible values: 'enabled'
  security_and_compliance_enabled: boolean
  compliance_frameworks: unknown[]
  permissions: Record<string, PermissionAccess|null>
}

export type Issue = {
  id: number
  iid: number|null
  project_id: number
  title: string
  description: string|null
  state: string // possible values 'opened'
  created_at: string
  updated_at: string
  closed_at: string|null
  closed_by: unknown|null
  labels: string[]
  milestone: unknown|null // possible type Milestone
  assignees: SimpleUser[] // possible type SimpleUser[]
  author: SimpleUser
  type: string // possible values: 'ISSUE'
  assignee: SimpleUser|null // possible type SimpleUser
  user_notes_count: number
  merge_requests_count: number
  upvotes: number
  downvotes: number
  due_date: string|null
  confidential: boolean
  discussion_locked: unknown|null
  issue_type: string // possible values: 'issue'
  web_url: string
  time_stats: TimeStats
  task_completion_status: TaskCompletionStatus
  blocking_issues_count: number
  has_tasks: boolean
  task_status: string
  _links: {
    self: string
    notes: string
    award_emoji: string
    project: string
    closed_as_duplicate_if: string|null
  }
  references: {
    short: string
    relative: string
    full: string
  }
  severity: string // possible values: 'UNKNOWN',
  moved_to_id: number|null
  imported: boolean
  imported_from: string
  service_desk_reply_to: string|null
}

export type MergeRequest = {
  id: number
  iid: number|null
  project_id: number
  title: string
  description: string|null
  state: string // possible values: 'opened'
  created_at: string
  updated_at: string
  merged_by: unknown|null
  merge_user: unknown|null
  merged_at: string|null
  closed_by: unknown|null
  closed_at: string|null
  target_branch: string
  source_branch: string
  user_notes_count: number
  upvotes: number
  downvotes: number
  author: SimpleUser
  assignees: SimpleUser[]
  assignee: SimpleUser|null
  reviewers: SimpleUser[]
  source_project_id: number
  target_project_id: number
  labels: string[]
  draft: boolean
  imported: boolean
  imported_from: string
  work_in_progress: boolean
  milestone: unknown|null // possible type Milestone
  merge_when_pipeline_succeeds: boolean
  merge_status: string
  detailed_merge_status: string // possible values: 'mergeable'
  sha: string
  merge_commit_sha: string|null
  squash_commit_sha: string|null
  discussion_locked: unknown|null
  should_remove_source_branch: unknown|null
  force_remove_source_branch: boolean
  prepared_at: string|null
  reference: string
  references: {
    short: string
    relative: string
    fill: string
  }
  web_url: string
  time_stats: TimeStats
  squash: boolean
  squash_on_merge: boolean
  task_completion_status: TaskCompletionStatus
  has_conflicts: boolean
  blocking_discussions_resolved: boolean
  approvals_before_merge: unknown|null
}

export type TimeStats = {
  time_estimate: number
  total_time_spent: number
  human_time_estimate: number|null
  human_total_time_spent: number|null
}

export type TaskCompletionStatus = {
  count: number
  completed_count: number
}

export type PermissionAccess = {
  access_level: number
  notification_level: number
}

export type ExpirationPolicy = {
  cadance: string
  enabled: boolean
  keep_n: number
  older_than: string
  name_regex: string
  name_regex_keep: unknown|null
  next_run_at: string|null
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

export type EventNote = {
  id: number
  type: string|null
  body: string|null
  attachment: unknown|null
  author: SimpleUser
  created_at: string
  updated_at: string
  system: boolean
  noteable_id: number
  noteable_type: string // possible values: 'Issue'
  project_id: number
  resolvable: false
  confidential: boolean
  internal: boolean
  imported: boolean
  imported_from: string
  noteable_iid: number
  commands_changes: Record<string, any>
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

export type ListQuery = Partial<{
  page: number
  per_page: number
}>