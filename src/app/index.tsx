import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";

import { 
  Inter_300Light, 
  Inter_400Regular, 
  Inter_600SemiBold, 
  Inter_700Bold 
} from "@expo-google-fonts/inter";

import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import PrimaryButton from "@src/components/buttons/PrimaryButton";
import { DialogMethods } from "@src/components/dialogs/Dialog";
import AccountTypeDialog from "@src/components/dialogs/AccountTypeDialog";
import { AccountType } from "@src/api/types";
import { slug } from "@src/utils/strings";
import { useGitApi } from "@src/providers/GitApiProvider";
import colors from "@src/utils/colors";

export default function HomeScreen() {
  const { setService } = useGitApi();
  const dialogRef = useRef<DialogMethods>(null);
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

  const onConnectPress = () => {
    dialogRef.current?.show();
  }

  const onAccountTypeChoose = (accountType: AccountType) => {
    if (!setService) {
      throw new Error('Missing necessary function for setting up service for api resolver!');
    }

    if (!dialogRef.current) {
      return;
    }

    dialogRef.current.hide();
    setTimeout(async () => {
      // await invalidateQuery();
      setService(accountType);
      router.navigate(`auth/pat?type=${slug(accountType)}`);
    }, 150);
  }

  return (
    <View style={styles.container}>
      <Image source={require('@assets/img/splash_temp.png')} style={styles.logo} />
      <View style={styles.bottom}>
        <View style={{ gap: 12, display: 'none' }}>
          <ActivityIndicator size="large" color="black" />
          <Text style={{ fontSize: 14 }}>Signing in...</Text>
        </View>
        <PrimaryButton text="Connect" style={{ backgroundColor: colors.primary }} onPress={onConnectPress} />
      </View>
      <AccountTypeDialog 
        ref={dialogRef} 
        title="Select account type" 
        onTypeChoose={onAccountTypeChoose} />
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
    width: 300,
    height: 300,
  },

  bottom: {
    position: 'absolute',
    bottom: 100,
  }
});
