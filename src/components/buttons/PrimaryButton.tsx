import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet
} from "react-native";
import React from "react";

export type PrimaryButtonProps = TouchableOpacityProps & {};

const PrimaryButton = ({ style = {}, ...props }: PrimaryButtonProps) => {
  function resolveStyle() {
    return {
      ...styles.container,
      ...(style as object)
    };
  }

  return (
    <TouchableOpacity {...props} style={resolveStyle()}></TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: '#2563eb',
  }
});

export default PrimaryButton;
