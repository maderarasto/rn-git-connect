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

export type User = {
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
}

export type FilterTag = {
    key: string
    label: string
    selected?: boolean
}

export type SortBy = typeof SortByItems[number];

// Deprecated
export type PropViewStyle = StyleProp<ViewStyle>;