export type ApiType = 'GitHub' | 'GitLab';

export type AuthUser = {
    id: number
    email: string
    name: string
    avatar_url: string
    bio: string
    location: string
    followers: number
    following: number
} & ({
    accountType: 'GitHub'
    login: string
    url: string
    twitter_username: string
    company: string
} | {
    accountType: 'GitLab',
    username: string
    web_url: string
    organization: string
});