import { View, Text } from "react-native";
import React, { useContext } from "react";
import { AuthUserContext } from "@src/context/AuthUserContext";
import { SafeAreaView } from "react-native-safe-area-context";

const Page = () => {
  const authUserContext = useContext(AuthUserContext);

  if (!authUserContext) {
    throw new Error('AuthUserContext must be used withing AUthUserProvider!');
  }
  
  console.log(authUserContext.user);

  return (
    <SafeAreaView>
      <Text>Dashboard</Text>
    </SafeAreaView>
  );
};

export default Page;
