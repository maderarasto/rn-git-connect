import { View, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import useEventsQuery from '@src/hooks/query/useEventsQuery'
import { useAuth } from '@src/providers/AuthProvider'
import EventListItem from '@src/components/EventListItem'
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
    resetQuery,
  } = useEventsQuery(authContext?.user?.username ?? '', {
    queryKey: 'getAllEvents',
    params: { perPage: 20 },
    enabled: true,
  });

  useEffect(() => {
    if (!error) return;

    console.log(error);
  }, [error]);

  const isLastItem = (item: Event, index: number) => {
    return index === ((events?.pages.flat().length ?? 0) - 1);
  }

  const onEventListReachedEnd = async () => {
    if (!isFetching && hasNextPage) {
      await fetchNextPage();
    }
  }

  return (
    <View style={styles.container}>
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