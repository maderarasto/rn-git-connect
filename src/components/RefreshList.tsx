import { View, Text, StyleSheet, FlatList, FlatListProps, ViewStyle, ActivityIndicator } from 'react-native'
import React from 'react'
import {Ionicons} from '@expo/vector-icons';
import PrimaryButton from './buttons/PrimaryButton'
import colors from '@src/utils/colors'

export type RefreshListProps<T> = FlatListProps<T> & {
 containerStyle?: ViewStyle
 isLoading?: boolean
 loadingMessage?: string
 onRetry?: () => void
}

const RefreshList = <T,>({
  containerStyle = {},
  isLoading = false,
  loadingMessage = '',
  onRetry,
  ...listProps
}: RefreshListProps<T>) => {
  const shouldRenderList = () => {
    return (listProps.data?.length ?? 0) > 0 || isLoading; 
  }

  const resolveContainerStyle = () => {
    const resolvedStyle: ViewStyle = {
      ...styles.container,
      ...containerStyle,
    };

    return resolvedStyle;
  }

  const renderLoading = () => isLoading ? (
    <View style={styles.loading}>
      <ActivityIndicator 
        size="large" 
        color="#2563eb" 
        style={{}} />
      {loadingMessage ? (
        <Text style={{ fontSize: 14 }}>Loading</Text>
      ) : ''}
    </View>
  ): '';

  return (
    <View style={resolveContainerStyle()}>
      {shouldRenderList() ? (
        <FlatList 
          ListFooterComponent={renderLoading}
          {...listProps} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, padding: 32}}>
          <Text style={{ fontSize: 18, color: 'gray' }}>No items found</Text>
          <PrimaryButton 
            text="Try again" 
            icon={<Ionicons name="refresh" size={16} color="white" />}
            style={styles.retryButton} 
            textStyle={styles.retryButtonText}
            onPress={onRetry} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loading: {
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 12,
  },

  retryButton: {
    paddingHorizontal: 12, 
    paddingVertical: 8,
    backgroundColor: colors.primary,
  },

  retryButtonText: {
    fontSize: 12
  }
})

export default RefreshList