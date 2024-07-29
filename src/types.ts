import { StyleProp, ViewStyle } from "react-native";
import { SortByItems } from "./structures";

export type ApiType = (
    | 'GitHub'
    | 'GitLab'
);

export type AccountType = (
    | 'GitHub'
    | 'GitLab'
    | 'Git'
);

export type Connection = {
    type: AccountType
    username: string
    email: string
    expired?: boolean
};

export type User = Partial<{
    accountType: AccountType
    id: number
    username: string
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
}>

export type Repository = Partial<{
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
}>

export type FilterTag = {
    key: string
    label: string
    selected?: boolean
}

export type SortBy = typeof SortByItems[number];

export type Tag = {
    label: string
    key?: string
    selected?: boolean
};

// Deprecated
export type PropViewStyle = StyleProp<ViewStyle>;