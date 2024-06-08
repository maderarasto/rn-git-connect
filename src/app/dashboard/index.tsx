import { View, Text, Modal } from "react-native";
import React, { useContext } from "react";
import { AuthUserContext } from "@src/context/AuthUserContext";
import { SafeAreaView } from "react-native-safe-area-context";

const Page = () => {
  const authUserContext = useContext(AuthUserContext);

  if (!authUserContext) {
    throw new Error('AuthUserContext must be used withing AUthUserProvider!');
  }
  
  console.log(`UserId: ${authUserContext.user?.id}`);

  return (
    <View>
      <Text>Dashboard</Text>
    </View>
  );
};

export default Page;
