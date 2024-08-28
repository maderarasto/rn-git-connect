import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

import BaseHeader from '@src/components/headers/BaseHeader';
import UserCard from '@src/components/UserCard';
import { useContext, useEffect } from 'react';
import { AuthUserContext } from '@src/context/AuthUserContext';
import UserInfo from '@src/components/UserInfo';
import UserContact from '@src/components/UserContact';
import PrimaryButton from '@src/components/buttons/PrimaryButton';
import ActivityItem from '@src/components/ActivityItem';
import { useAuthEventsQuery } from '@src/hooks/queries/useAuthEventsQuery';
import useBackHandler from '@src/hooks/useBackHandler';

const Page = () => {
  const authUserContext = useContext(AuthUserContext);

  if (!authUserContext) {
    throw new Error('AuthUserContext must be used within AuthUserProvider!');
  }
  
  const authUser = authUserContext.user;

  if (!authUser) {
    throw new Error("Auth user must be initialized after successful login!");
  }

  const router = useRouter();

  useEffect(() => {
    invalidateQuery();
  }, []);

  const {
    data: events,
    isFetching,
    error,
    invalidateQuery
  } = useAuthEventsQuery();

  async function onBackPress() {
    router.back();
  }

  return (
    <View style={styles.container}>
      <BaseHeader options={{
        headerLeft: () => (
          <TouchableOpacity onPress={onBackPress}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
        ),
        title: 'Your Profile'
      }} />
      <ScrollView>
        <View style={{ marginBottom: 24, paddingHorizontal: 24, }}>
          <UserCard user={authUser} size="large" style={{ width: '100%', paddingHorizontal: 0 }} />
        </View>
        <View style={{ paddingHorizontal: 24, }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' }}>About</Text>
          <Text style={{ fontSize: 16, }}>{authUser.bio}</Text>
        </View>
        <View style={{ flexDirection: 'column', gap: 12, paddingHorizontal: 24, paddingVertical: 12 }}>
          <UserInfo user={authUser} style={{ flex: 1, }} />
          <UserContact user={authUser} style={{ flex: 1 }} />
          <PrimaryButton style={{ alignSelf: 'flex-end', marginVertical: 12 }}>
            <Text style={{ color: 'white' }}>Edit profile</Text>
          </PrimaryButton>
        </View>
        <View style={{ paddingHorizontal: 24, paddingVertical: 12 }}>
          <Text style={{ marginBottom: 12, fontSize: 20, fontWeight: 'bold' }}>Your recent activity</Text>
          <View>
            {events?.pages.flat().map((activityEvent, index, allEvents) => (
              <ActivityItem 
                event={activityEvent}
                key={activityEvent.id}
                last={index === (allEvents.length - 1)} />
            ))}
            {isFetching ? (
              <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 36}} />
            ) : ''}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default Page;