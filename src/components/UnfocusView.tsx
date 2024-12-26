import React, {PropsWithChildren} from "react";
import {Keyboard, TouchableWithoutFeedback, View, ViewStyle} from "react-native";

export type UnfocusViewProps = PropsWithChildren & {
  style?: ViewStyle
}

const UnfocusView = ({
  children,
  style = {}
}: UnfocusViewProps) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={style}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
}

export default UnfocusView;