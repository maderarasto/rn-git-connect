import {Platform, StyleSheet, ToastAndroid, TouchableOpacity, View} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useAuth} from "@src/providers/AuthProvider";
import BaseHeader from "@src/components/headers/BaseHeader";
import {AntDesign} from "@expo/vector-icons";
import React from "react";

const SearchRepositoriesListScreen = () => {
  const {language} = useLocalSearchParams<{ language: string }>();

  const authContext = useAuth();
  const router = useRouter();

  if (!language) {
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity('Missing programming language', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    }

    router.back();
  }

  const onBackPress = () => {
    router.back();
  }

  if (!authContext) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BaseHeader options={{
        titleStyle: { flex: 1 },
        headerLeft: () => (
          <TouchableOpacity onPress={onBackPress}>
            <AntDesign name="arrowleft" size={24} color="black"/>
          </TouchableOpacity>
        ),
        title: `Repositories with ${language}`,
      }}/>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default SearchRepositoriesListScreen;