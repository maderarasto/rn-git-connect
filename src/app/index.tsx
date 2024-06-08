import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { useFonts } from "expo-font";

import { 
  Inter_300Light, 
  Inter_400Regular, 
  Inter_600SemiBold, 
  Inter_700Bold 
} from "@expo-google-fonts/inter";

import { AccountType } from "@src/types";
import { useRouter } from "expo-router";
import { convertToSlug } from "@src/utils";
import useActiveAccount from "@src/hooks/useActiveAccount";
import useAuthQuery from "@src/hooks/useAuthQuery";
import { ApiType } from "@src/api/types";
import { AuthUserContext} from "@src/context/AuthUserContext";
import AccountTypeDialog from "@src/components/modals/AccountTypeDialog";
import { DialogMethods } from "@src/components/modals/Dialog";

export default function Page() {
  const [canRedirect, setCanRedirect] = useState(false);

  const {
    accountType,
    accountToken,
    isLoading
  } = useActiveAccount();

  const {
    data: authUser,
    isLoading: isAuthLoading,
    error: authError,
    refetch
  } = useAuthQuery(accountType as ApiType);

  const authUserContext = useContext(AuthUserContext);
  const dialogRef = useRef<DialogMethods>(null);
  const router = useRouter();

  let [fontsLoaded, fontError] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold
  });

  useEffect(() => {    
    if (hasAnyAccount()) {
      refetch(); 
    }
  }, [isLoading]);

  useEffect(() => {
    if (isAuthorized() && authUser) {
      authUserContext?.setUser(authUser);
      setCanRedirect(true);
    }
  }, [isAuthLoading]);

  useEffect(() => {
    if (canRedirect) {
      router.replace('dashboard');
    }
  }, [canRedirect]);

  function hasAnyAccount() {
    return !isLoading && accountType && accountToken;
  }

  function isAuthorized() {
    return !isLoading && !isAuthLoading && !authError;
  }

  function onConnectButtonPress() {
    if (!dialogRef.current) {
      return;
    }

    dialogRef.current.show();
  }

  function onAccountTypeChoose(accountType: AccountType) {
    if (!dialogRef.current) {
      return;
    }

    dialogRef.current.hide();
    router.navigate(`auth/pat?type=${convertToSlug(accountType)}`);
  }

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image source={require('@assets/img/splash.png')} style={{ width: '100%', height: '100%'}} resizeMode="center" />
      <View style={styles.bottomArea}>
        {isLoading || isAuthLoading ? (<ActivityIndicator size={42} color="black" />) : ''}
        {!accountType || (!isAuthLoading && authError) ? (
          <TouchableOpacity style={styles.connectBtn} onPress={onConnectButtonPress}>
            <Text style={{ fontSize: 16, color: 'white' }}>Connect</Text>
          </TouchableOpacity>
        ) : ''}
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
    flex: 1,
  },
  
  bottomArea: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },

  connectBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    textTransform: 'uppercase',
    backgroundColor: 'black'
  }
});
