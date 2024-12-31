import {StyleSheet, TouchableOpacity, View, ScrollView} from "react-native";
import BaseHeader from "@src/components/headers/BaseHeader";
import {AntDesign} from "@expo/vector-icons";
import React from "react";
import UserCard from "@src/components/UserCard";
import {useRouter} from "expo-router";
import {useAuth} from "@src/providers/AuthProvider";
import EditProfileForm from "@src/components/forms/EditProfileForm";

const EditProfilePage = () => {
  const router = useRouter();
  const authContext = useAuth();

  async function onBackPress() {
    router.back();
  }

  if (!authContext?.user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BaseHeader options={{
        headerLeft: () => (
          <TouchableOpacity onPress={onBackPress}>
            <AntDesign name="arrowleft" size={24} color="black"/>
          </TouchableOpacity>
        ),
        title: 'Edit Your Profile'
      }}/>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={{marginBottom: 8, paddingHorizontal: 24,}}>
          <UserCard user={authContext.user} size="large" style={styles.userCard}/>
        </View>
        <EditProfileForm user={authContext.user} />
      </ScrollView>
    </View>

  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    flexGrow: 1,
  },

  userCard: {
    width: '100%',
    paddingHorizontal: 0
  },

  group: {
    marginBottom: 12,
    paddingHorizontal: 24,
  },

  groupLabel: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 'bold',
    color: 'gray',
  },

  groupInput: {
    marginBottom: 8,
  }
});

export default EditProfilePage