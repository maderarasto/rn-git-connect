import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"
import * as SecureStore from 'expo-secure-store';
import useConnections, { Connection } from "@src/hooks/useConnections"

import { AccountType, User } from "@src/api/types"
import useLocalStorage from "@src/hooks/useLocalStorage";
import { capitalize, slug } from "@src/utils/strings";
import { useApi } from "./ApiProvider";

export type AuthContext = {
  user: User|null
  token: string|null
  service: string|null
  setUser: (user: User) => void
  saveAccount: (user: User, token: string) => Promise<void>
}

const AuthContext = createContext<AuthContext|null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User|null>(null);
  const [accountId, setAccountId] = useLocalStorage<string>('active_account_id');
  const [token, setToken] = useState<string|null>(null);

  const {service, setService} = useApi();
  const connections = useConnections();

  useEffect(() => {
    if (!accountId) {
      return;
    }
    
    resolveService();
    loadAccountToken(accountId)
  }, [accountId]);

  const resolveService = () => {
    if (!accountId) {
      return;
    }

    const [_, slug] = accountId.match(/(\w+)[-]token/) ?? [];
    
    if (setService) {
      setService(capitalize(slug) as AccountType);
    }
  }

  const loadAccountToken = async (accountId: string) => {
    if (accountId.length === 0) {
      throw new Error('Account ID shouldn\'t be empty string!');
    }

    const accountToken = await SecureStore.getItemAsync(accountId);
    setToken(accountToken);
  }

  const saveAccountToken = async (accountId: string, accountToken: string) => {
    if (accountId.length === 0) {
      throw new Error('Account ID shouldn\'t be empty string!');
    }

    await SecureStore.setItemAsync(accountId, accountToken);
  }

  const saveAccount = async (user: User, token: string) => {
    const conn: Connection = {
      account_id: `${slug(user.service)}-token.${user.username ?? ''}`,
      service: user.service,
      username: user.username as string,
      fullname: user.fullname,
    };

    await connections.saveConnection(conn);
    await saveAccountToken(conn.account_id, token);
    setAccountId(conn.account_id);
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      service,
      setUser,
      saveAccount
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);