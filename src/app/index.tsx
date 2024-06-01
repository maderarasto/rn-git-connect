import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRef } from "react";
import { useFonts } from "expo-font";

import { 
  Inter_300Light, 
  Inter_400Regular, 
  Inter_600SemiBold, 
  Inter_700Bold 
} from "@expo-google-fonts/inter";

import AccountTypeModal, { AccountTypeModalMethods } from "@src/components/AccountTypeModal";
import { AccountType } from "@src/types";
import { useRouter } from "expo-router";
import { convertFromSlug, convertToSlug } from "@src/utils";

export default function Page() {
  const modalRef = useRef<AccountTypeModalMethods>(null);
  const router = useRouter();

  let [fontsLoaded, fontError] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold
  });

  function onConnectButtonPress() {
    if (!modalRef.current) {
      return;
    }

    modalRef.current.show();
  }

  function onAccountTypeChoose(accountType: AccountType) {
    if (!modalRef.current) {
      return;
    }

    modalRef.current.hide();
    router.navigate(`auth/pat?type=${convertToSlug(accountType)}`);
  }

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image source={require('@assets/img/splash.png')} style={{ width: '100%', height: '100%'}} resizeMode="center" />
      <View style={styles.bottomArea}>
        {/* <ActivityIndicator size={42} color="black" /> */}
        <TouchableOpacity style={styles.connectBtn} onPress={onConnectButtonPress}>
          <Text style={{ fontSize: 16, color: 'white' }}>Connect</Text>
        </TouchableOpacity>
      </View>
      <AccountTypeModal ref={modalRef} title="Select account type" modalStyle={{ height: '20%', }} onTypeChoose={onAccountTypeChoose} />
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
