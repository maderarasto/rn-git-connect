import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import {Feather} from '@expo/vector-icons';
import PrimaryButton from '@src/components/buttons/PrimaryButton'
import { useAuth } from '@src/providers/AuthProvider'
import { useFocusEffect, useRouter } from 'expo-router'
import colors from '@src/utils/colors'
import UserCard from '@src/components/UserCard'
import UserInfo from '@src/components/UserInfo'
import UserContacts from '@src/components/UserContacts'
import useEventsQuery from '@src/hooks/query/useEventsQuery';
import EventListItem from '@src/components/EventListItem';
import RefreshListView from '@src/components/views/RefreshListView';
import {useApi} from "@src/providers/ApiProvider";

const UserProfileScreen = () => {
  const [isQueryEnabled, setIsQueryEnabled] = useState(false);

  const authContext = useAuth();
  const router = useRouter();
  const api = useApi();

  const {
    data: events,
    isFetching,
    invalidateQuery,
    resetQuery,
  } = useEventsQuery(authContext?.user?.username ?? '', {
    queryKey: 'getRecentEvents',
    enabled: isQueryEnabled,
  });

  useEffect(() => {
    return () => {
      invalidateQuery('getRecentEvents');
    }
  }, []);

  useEffect(() => {
    if (authContext?.user?.username) {
      setIsQueryEnabled(true);
    }
  }, [authContext?.user?.username]);

  useFocusEffect(useCallback(() => {
    resetQuery('getAllEvents');
  }, []));

  function onEditProfilePress() {
    router.navigate('(manage)/profile/edit');
  }

  if (!authContext?.user) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.userCardWrapper}>
        <UserCard 
          user={authContext.user}
          size="large" 
          style={styles.userCard} />
      </View>
      <View style={styles.bioSection}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' }}>About</Text>
        <Text style={{ fontSize: 16, color: '#707070' }}>{authContext?.user?.bio}</Text>
      </View>
      <View style={{ gap: 12, marginHorizontal: 24, paddingVertical: 12,  }}>
        <View style={styles.detailsSection}>
          <UserInfo user={authContext.user} style={{ flex: 1, }} />
          <UserContacts user={authContext.user} style={{ flex: 1 }} />
        </View>
        {api.service !== 'Gitlab' ? (
          <PrimaryButton
            text="Edit profile"
            icon={<Feather name="edit-2" size={14} color="white" />}
            style={styles.editProfileButton}
            onPress={onEditProfilePress} />
        ) : ''}
      </View>
      <View style={styles.recentActivitySection}>
        <Text style={styles.recentActivityHeader}>Your recent activity</Text>
        <RefreshListView 
          data={events?.pages.flat()} 
          keyExtractor={(item) => item.id.toString()}
          renderItem={(item, index, all) => (
            <EventListItem
              event={item}
              last={index === (all.length-1)} />
          )} 
          onRetry={() => invalidateQuery()}
          isLoading={isFetching} />
      </View>
    </ScrollView>

  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 70,
  },

  userCardWrapper: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },

  userCard: {
    width: '100%',
    paddingHorizontal: 0
  },

  bioSection: {
    marginHorizontal: 24,
    paddingBottom: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },

  detailsSection: {
    gap: 12,
    paddingBottom: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },

  editProfileButton: {
    alignSelf: 'flex-end',
    marginVertical: 12,
    backgroundColor: colors.primary
  },

  recentActivitySection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },

  recentActivityHeader: {
    marginBottom: 16,
    fontSize: 20,
    fontWeight: 'bold'
  }
})

export default UserProfileScreen