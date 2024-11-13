import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ApiProvider from "@src/providers/ApiProvider";
import AuthProvider from "@src/providers/AuthProvider";
import { Slot, Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { DB_NAME, migrateDB } from "@src/utils/localdb";

const client = new QueryClient();

const RootLayout = () => {
  return (
    <QueryClientProvider client={client}>
      <ApiProvider>
        <SQLiteProvider databaseName={DB_NAME} onInit={migrateDB}>
          <AuthProvider>
            <Slot />
          </AuthProvider>
        </SQLiteProvider>
      </ApiProvider>
    </QueryClientProvider>
  );
}

export default RootLayout;