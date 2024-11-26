import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import useEventsQuery from '@src/hooks/useEventsQuery'
import { useAuth } from '@src/providers/AuthProvider'
import EventListItem from '@src/components/EventListItem'
import useBackHandler from '@src/hooks/useBackHandler'
import { useRouter } from 'expo-router'

const ActiviesScreen = () => {
  const authContext = useAuth();
  
  const {
    data: events,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    invalidateQuery
  } = useEventsQuery(authContext?.user?.username ?? '', {
    queryKey: 'getAllEvents',
    params: { perPage: 20 },
    enabled: true,
  });

  const renderActivityIndicator = () => {
    return isLoading ? (
      <ActivityIndicator 
          size="large" 
          color="#2563eb" 
          style={styles.loadingIndicator} />
    ) : '';
  }

  const onEventListReachedEnd = () => {
    if (!isLoading) {
      fetchNextPage();
    }
  }

  return (
    <View style={styles.container}>
      <FlatList 
        contentContainerStyle={{ paddingBottom: 70}}
        data={events?.pages.flat()}
        keyExtractor={(event) => event.id.toString()}
        renderItem={({item: event, index}) => {
          return (
            <EventListItem 
              event={event}
              last={index === ((events?.pages.flat().length ?? 0) - 1)} />
          );
        }}
        ListFooterComponent={renderActivityIndicator}
        onEndReachedThreshold={0.75}
        onEndReached={onEventListReachedEnd}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  loadingIndicator: {
    padding: 32
  }
});


export default ActiviesScreen