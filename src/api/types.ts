export type ServiceType = (
  | 'Github'
  | 'Gitlab'
);

export type ApiAdapter = {
  getUser: (user: any) => User
  // toApiUser: (user: User) => any
};

export type User = {
  id: number
  service: ServiceType,
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