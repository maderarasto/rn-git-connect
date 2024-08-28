import { StyleProp, ViewStyle } from "react-native";
import { SortByItems } from "./structures";

export type ApiType = (
    | 'GitHub'
    | 'GitLab'
);

export type AccountType = (
    | 'GitHub'
    | 'GitLab'
);

export type Connection = {
    accountId: string
    type: AccountType
    username: string
    email: string
    expired?: boolean
};

export type QueryProps = {
    queryKey: string
    callback: (accountToken?: string) => Promise<any>
};

export type InfiniteQueryProps = {
    queryKey: string,
    callback: (props: Record<string, any> ) => Promise<any>
}

export type AccountQueryProps = Record<AccountType, QueryProps>;
export type AccountInfiniteQueryProps = Record<AccountType, InfiniteQueryProps>;

export type AbortControllerRef = React.MutableRefObject<AbortController | null>;

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

export type ActivityEventType = (
    | 'CreateEvent'
    | 'DeleteEvent'
    | 'ForkEvent'
    | 'IssueCommentEvent'
    | 'IssuesEvent'
    | 'PullRequestEvent'
    | 'PushEvent'
);

export type IssueLabel = {
    id: number
    name: string
    description: string
    color: string
};

export type IssueComment = {
    id: number
    nodeId: string
    body?: string
    user: User
    url: string
    htmlUrl: string
    issueUrl: string
    createdAt: string
    updatedAt: string
};

export type Issue = {
    id: number
    number: number
    title: string
    body?: string
    labels: IssueLabel[]
    state: string
    commentCount: number
    user: User
    createdAt: string
    updatedAt: string
    closedAt: string
};

export type ActivityEventPayload = Partial<{
    repoId: number
    commitCount: number
    commitTitle: string
    head: string
    issue: Issue
    comment: IssueComment
}>;

export type ActivityEvent = {
    id: number
    type: ActivityEventType
    author: User
    repo: Repository
    payload: ActivityEventPayload
    createdAt: string
}

// Deprecated
export type PropViewStyle = StyleProp<ViewStyle>;