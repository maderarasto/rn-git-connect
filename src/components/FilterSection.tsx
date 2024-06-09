import { View, Text, StyleSheet, ViewStyle } from "react-native";
import React, { ReactNode } from "react";

export type FilterSectionProps = {
  label: string;
  contentStyle?: ViewStyle,
  children?: ReactNode;
};

const FilterSection = ({
  label,
  contentStyle = {},
  children,
}: FilterSectionProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={contentStyle}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#6b7280',
  },
});

export default FilterSection;
