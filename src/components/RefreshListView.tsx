import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import {Ionicons} from '@expo/vector-icons';
import PrimaryButton from './buttons/PrimaryButton'
import colors from '@src/utils/colors'

export type RefreshListViewProps<T = any> = {
  renderItem: (item: T, index: number, all: T[]) => JSX.Element
  data?: T[]|null
  keyExtractor?: (item: T, index: number) => string
  loadingMessage?: string
  isLoading?: boolean
}

const RefreshListView = <T,>({
  data = [],
  renderItem,
  keyExtractor,
  loadingMessage = '',
  isLoading = false
}: RefreshListViewProps<T>) => {
  const shouldRenderData = () => {
    return isLoading || (data?.length ?? 0) > 0;
  }

  const resolveItemKey = (item: T, index: number) => {
    if (!keyExtractor) {
      return `item_${index + 1}`;
    }

    return keyExtractor(item, index);
  }

  const renderLoading = () => (
    <View style={styles.loading}>
      <ActivityIndicator 
        size="large" 
        color="#2563eb" 
        style={{}} />
      {loadingMessage ? (
        <Text style={{ fontSize: 14 }}>Loading</Text>
      ) : ''}
    </View>
  );

  if (!shouldRenderData()) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, padding: 32}}>
        <Text style={{ fontSize: 16, color: 'gray' }}>No items found</Text>
        <PrimaryButton 
          text="Try again" 
          icon={<Ionicons name="refresh" size={16} color="white" />}
          style={styles.retryButton} 
          textStyle={styles.retryButtonText} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data?.map((item, index, all) => (
        <View key={resolveItemKey(item, index)}>
          {renderItem(item, index, all)}
        </View>
      ))}
      {isLoading ? renderLoading() : ''}
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
    padding: 12,
  },

  retryButton: {
    paddingHorizontal: 12, 
    paddingVertical: 8,
    backgroundColor: colors.primary,
  },

  retryButtonText: {
    fontSize: 12
  }
});

export default RefreshListView