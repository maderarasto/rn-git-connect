import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";

import { 
  Inter_300Light, 
  Inter_400Regular, 
  Inter_600SemiBold, 
  Inter_700Bold 
} from "@expo-google-fonts/inter";

import { useRouter } from "expo-router";
import { useEffect } from "react";
import PrimaryButton from "@src/components/PrimaryButton";

export default function Page() {
  const router = useRouter();

  let [fontsLoaded, fontError] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  useEffect(() => {
    router
  }, [])

  return (
    <View style={styles.container}>
      <Image source={require('@assets/img/icon.png')} style={styles.logo} />
      <View style={styles.bottom}>
        <View style={{ gap: 12, display: 'none' }}>
          <ActivityIndicator size="large" color="black" />
          <Text style={{ fontSize: 14 }}>Signing in...</Text>
        </View>
        <PrimaryButton text="Connect" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 200,
    height: 200,
  },

  bottom: {
    position: 'absolute',
    bottom: 100,
  }
});
