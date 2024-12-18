import {View, Text, StyleSheet} from "react-native";
import {ReactNode} from 'react';

export type FormGroupProps = {
  title?: string
  children?: ReactNode
}

const FormGroup = ({
 title,
 children,
} : FormGroupProps) => {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>{title}</Text>
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {

  },

  headerLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#6b7280',
  },

  content: {
    padding: 8,
  }
})

export default FormGroup;
