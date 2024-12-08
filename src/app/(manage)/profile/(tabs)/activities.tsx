import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import useEventsQuery from '@src/hooks/useEventsQuery'
import { useAuth } from '@src/providers/AuthProvider'
import EventListItem from '@src/components/EventListItem'
import useBackHandler from '@src/hooks/useBackHandler'
import { useRouter } from 'expo-router'
import RefreshList from '@src/components/RefreshList'
import { Event } from '@src/api/types';

const ActiviesScreen = () => {
  const authContext = useAuth();
  
  const {
    data: events,
    isFetching,
    error,
    hasNextPage,
    fetchNextPage,
    invalidateQuery,
    resetQuery,
  } = useEventsQuery(authContext?.user?.username ?? '', {
    queryKey: 'getAllEvents',
    params: { perPage: 20 },
    enabled: true,
  });

  useEffect(() => {
    console.log(error);
  }, [error]);

  const isLastItem = (item: Event, index: number) => {
    return index === ((events?.pages.flat().length ?? 0) - 1);
  }

  const renderActivityIndicator = () => {
    return isFetching ? (
      <ActivityIndicator 
          size="large" 
          color="#2563eb" 
          style={styles.loadingIndicator} />
    ) : '';
  }

  const onEventListReachedEnd = () => {
    if (!isFetching) {
      fetchNextPage();
    }
  }

  return (
    <View style={styles.container}>
      {/* <FlatList 
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
        onEndReached={onEventListReachedEnd}/> */}
        <RefreshList
          data={events?.pages.flat()}
          keyExtractor={(event) => event.id.toString()}
          contentContainerStyle={{ paddingBottom: 70 }}
          onEndReachedThreshold={0.75}
          onEndReached={onEventListReachedEnd}
          renderItem={({ item, index }) => (
            <EventListItem 
              event={item}
              last={isLastItem(item, index)}
              />
          )}
          isLoading={isFetching}
          onRetry={() => resetQuery()}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  loadingIndicator: {
    padding: 32
  }
});


export default ActiviesScreen