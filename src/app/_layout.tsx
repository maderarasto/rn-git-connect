import React from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthUserContext, AuthUserProvider } from "@src/context/AuthUserContext";

const queryClient = new QueryClient();

const _layout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthUserProvider>
        <Stack
          initialRouteName="auth/pat"
          screenOptions={{
            headerShown: false
          }}
        >
          {/* <Stack.Screen name="manage/connections/index" /> */}
        </Stack>
      </AuthUserProvider>
    </QueryClientProvider>
  );
};

export default _layout;
