import AuthProvider from "@src/providers/AuthProvider";
import ApiProvider from "@src/providers/ApiProvider";
import { Slot, Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

const RootLayout = () => {
  return (
    <QueryClientProvider client={client}>
      <ApiProvider>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </ApiProvider>
    </QueryClientProvider>
  );
}

export default RootLayout;