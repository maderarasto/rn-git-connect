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