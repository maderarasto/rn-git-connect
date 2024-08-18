import { View, Text } from "react-native";
import React, { useContext, useEffect } from "react";
import { AuthUserContext } from "@src/context/AuthUserContext";

const Page = () => {
  const authUserContext = useContext(AuthUserContext);

  if (!authUserContext) {
    throw new Error('AuthUserContext must be used withing AUthUserProvider!');
  }

  return (
    <View>
      <Text>Dashboard</Text>
    </View>
  );
};

export default Page;
