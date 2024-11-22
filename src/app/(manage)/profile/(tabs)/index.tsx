import { View, Text, ScrollView, StyleSheet, ActivityIndicator, ViewStyle, LayoutChangeEvent } from 'react-native'
import React, { useState } from 'react'
import {AntDesign, Feather} from '@expo/vector-icons';
import PrimaryButton from '@src/components/buttons/PrimaryButton'
import { useAuth } from '@src/providers/AuthProvider'
import { useRouter } from 'expo-router'
import colors from '@src/utils/colors'
import UserCard from '@src/components/UserCard'
import UserInfo from '@src/components/UserInfo'
import UserContacts from '@src/components/UserContacts'
import { LayoutDimensions } from '@src/types'

const UserProfileScreen = () => {
  const [loadingLayout, setLoadingLayout] = useState<LayoutDimensions|null>(null);

  const authContext = useAuth();
  const router = useRouter();

  function resolveLoadingIndicatorStyle() {
    let style: ViewStyle = {
      ...styles.loadingIndicator
    };

    if (loadingLayout) {
      style.transform = [
        { translateX: -Math.trunc(loadingLayout.width / 2) },
        { translateY: -Math.trunc(loadingLayout.height / 2) - 12 },
      ]
    }

    return style;
  }

  const onLoadingIndicatorLayout = (ev: LayoutChangeEvent) => {
    const {x, y, width, height} = ev.nativeEvent.layout;
    setLoadingLayout({ x, y, width, height});
  }

  function onEditProfilePress() {
    router.navigate('(manage)/profile/edit');
  }

  if (!authContext?.user) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }}>
      <View style={{ marginBottom: 24, paddingHorizontal: 24, }}>
        <UserCard 
          user={authContext?.user} 
          size="large" 
          style={{ 
            width: '100%', 
            paddingHorizontal: 0 
          }} />
      </View>
      <View style={{ marginHorizontal: 24, paddingBottom: 12, borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' }}>About</Text>
        <Text style={{ fontSize: 16, color: '#707070' }}>{authContext?.user?.bio}</Text>
      </View>
      <View style={{ gap: 12, marginHorizontal: 24, paddingVertical: 12,  }}>
        <View style={{ gap: 12, paddingBottom: 12, borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
          <UserInfo user={authContext?.user} style={{ flex: 1, }} />
          <UserContacts user={authContext?.user} style={{ flex: 1 }} />
        </View>
        <PrimaryButton 
          text="Edit profile"
          icon={<Feather name="edit-2" size={14} color="white" />}
          style={{ 
            alignSelf: 'flex-end', 
            marginVertical: 12,
            backgroundColor: colors.primary 
          }} 
          onPress={onEditProfilePress} />
      </View>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 12, }}>
        <Text style={{ marginBottom: 16, fontSize: 20, fontWeight: 'bold' }}>Your recent activity</Text>
        <View style={{ flex: 1 }}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator 
              size="large" 
              color="#2563eb" 
              style={resolveLoadingIndicatorStyle()}
              onLayout={onLoadingIndicatorLayout} />
          </View>
          {/* {events?.pages.flat().map((activityEvent, index, allEvents) => (
            <ActivityItem 
              event={activityEvent}
              key={activityEvent.id}
              last={index === (allEvents.length - 1)} />
          ))} */}
        </View>
      </View>
      {/* {isFetching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="large" 
            color="#2563eb" 
            style={resolveLoadingIndicatorStyle()}
            onLayout={onLoadingIndicatorLayout} />
        </View>
      ) : '' } */}
    </ScrollView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loadingContainer: {
    position: 'relative',
    flexGrow: 1,
  },

  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  }
})

export default UserProfileScreen