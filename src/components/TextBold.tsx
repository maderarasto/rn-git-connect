import { View, Text, TextProps, StyleProp, TextStyle } from "react-native";
import React from "react";

const TextBold = ({ 
  style = {}, 
  children,
  ...props 
}: TextProps) => {
  function resolveStyle() {
    let textStyle: StyleProp<TextStyle> = {
      ...style as object,
      fontWeight: 'bold'
    };

    return textStyle;
  }

  return (
    <Text {...props} style={resolveStyle()}>{children}</Text>
  );
};

export default TextBold;
