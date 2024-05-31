import { ActivityIndicator, Button, Dimensions, Image, Pressable, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, useWindowDimensions } from "react-native";
import GitServerModal, { AccountTypeModalMethods } from "../components/AccountTypeModal";
import { useEffect, useRef, useState } from "react";
import { SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { 
  Inter_300Light, 
  Inter_400Regular, 
  Inter_600SemiBold, 
  Inter_700Bold 
} from "@expo-google-fonts/inter";
import SlidedModal from "@src/components/SlidedModal";

export default function Page() {
  const modalRef = useRef<AccountTypeModalMethods>(null);

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

    modalRef.current.open();
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
      <SlidedModal modalStyle={{ height: '20%' }} shown>
        <Text>asd</Text>
      </SlidedModal>
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
