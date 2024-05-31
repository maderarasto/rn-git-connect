import { StyleProp, ViewStyle } from "react-native";

export type ServerType = (
    | 'GitHub'
    | 'GitLab'
    | 'Git'
);

export type PropViewStyle = StyleProp<ViewStyle>;