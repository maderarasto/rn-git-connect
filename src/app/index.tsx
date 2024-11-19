import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";

import { 
  Inter_300Light, 
  Inter_400Regular, 
  Inter_600SemiBold, 
  Inter_700Bold 
} from "@expo-google-fonts/inter";

import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import PrimaryButton from "@src/components/buttons/PrimaryButton";
import { DialogMethods } from "@src/components/dialogs/Dialog";
import AccountTypeDialog from "@src/components/dialogs/AccountTypeDialog";
import { AccountType, User } from "@src/api/types";
import { slug } from "@src/utils/strings";
import { useApi } from "@src/providers/ApiProvider";
import colors from "@src/utils/colors";
import { useAuth } from "@src/providers/AuthProvider";
import useAuthQuery from "@src/hooks/useAuthQuery";
import GithubClient from "@src/api/github/GithubClient";

export default function HomeScreen() {
  const [queryEnabled, setQueryEnabled] = useState(false);
  const [canRedirect, setCanRedirect] = useState(false);
  
  const { api } = useApi();
  const authContext = useAuth();

  const dialogRef = useRef<DialogMethods>(null);
  const router = useRouter();

  // useEffect(() => {
  //   const github = new GithubClient();

  //   github.getEvents('maderarasto', { page: 1, per_page: 10}).then((res) => console.log(res[0].actor)).catch((err) => console.error(err));
  // }, [])

  // return <ActivityIndicator />;

  let [fontsLoaded, fontError] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold
  });

  const {
    data: user,
    error,
    isLoading,
    invalidateQuery,
  } = useAuthQuery(authContext?.token ?? '', queryEnabled);

  useEffect(() => {
    if (!authContext?.token) {
      return;
    }
    
    setQueryEnabled(true);
  }, [authContext?.token]);

  useEffect(() => {
    const initializeUser = async () => {
      if (!user) {
        return;
      }

      authContext?.setUser(user);
      invalidateQuery();
      setCanRedirect(true);
    }
    
    if (!isLoading && user) {
      initializeUser();
    }
  }, [isLoading]);

  useEffect(() => {
    if (canRedirect) {
      router.replace('dashboard');
    }
  }, [canRedirect])

  const onConnectPress = () => {
    dialogRef.current?.show();
  }

  const onAccountTypeChoose = (accountType: AccountType) => {
    if (!api) {
      throw new Error('Missing API resolver!');
    }

    if (!dialogRef.current) {
      return;
    }

    dialogRef.current.hide();
    setTimeout(async () => {
      invalidateQuery();
      api.activeService = accountType;
      router.navigate(`auth/pat?type=${slug(accountType)}`);
    }, 150);
  }

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image source={require('@assets/img/splash_temp.png')} style={styles.logo} />
      <View style={styles.bottom}>
        {isLoading || (user && !canRedirect) ? (
          <View style={{ gap: 12 }}>
            <ActivityIndicator size="large" color="black" />
            <Text style={{ fontSize: 14 }}>Authenticating...</Text>
          </View>
        ) : <PrimaryButton text="Connect" style={{ backgroundColor: colors.primary }} onPress={onConnectPress} />}
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
