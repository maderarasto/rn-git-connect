import { StyleProp, ViewStyle } from "react-native";
import { SortByItems } from "./structures";

export type AccountType = (
    | 'GitHub'
    | 'GitLab'
    | 'Git'
);

export type FilterTag = {
    key: string
    label: string
    selected?: boolean
}

export type SortBy = typeof SortByItems[number];

// Deprecated
export type PropViewStyle = StyleProp<ViewStyle>;