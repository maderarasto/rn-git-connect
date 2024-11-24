import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"
import * as SecureStore from 'expo-secure-store';
import useConnections, { Connection } from "@src/hooks/useConnections"

import { AccountType, User } from "@src/api/types"
import useLocalStorage from "@src/hooks/useLocalStorage";
import { capitalize, slug } from "@src/utils/strings";
import { useApi } from "./ApiProvider";

export type AuthContext = {
  user: User|null
  accountId: string|null
  token: string|null
  service: string|null
  setUser: (user: User) => void
  setActiveAccount: (accountId: string) => void
  loadAccountToken: (accountId: string) => Promise<string|null>
  saveAccountToken: (accountId: string, token: string) => Promise<void>
  saveAccount: (user: User, token: string) => Promise<void>
}

const AuthContext = createContext<AuthContext|null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User|null>(null);
  const [activeAccount, setActiveAccount] = useLocalStorage<string>('active_account_id');
  const [token, setToken] = useState<string|null>(null);

  const {api, service, setService} = useApi();
  const connections = useConnections();

  useEffect(() => {
    if (!activeAccount) {
      return;
    }
    
    resolveService();
    loadActiveAccountToken()
  }, [activeAccount]);

  const resolveService = () => {
    if (!activeAccount) {
      return;
    }

    const [_, slug] = activeAccount.match(/(\w+)[-]token/) ?? [];
    
    if (setService) {
      setService(capitalize(slug) as AccountType);
    }
  }

  const loadActiveAccountToken = async () => {
    if (!activeAccount) {
      throw new Error('Account ID shouldn\'t be empty string!');
    }

    if (!api) {
      throw new Error('Missing important component: ApiResolver!');
    }

    const accountToken = await loadAccountToken(activeAccount);
    
    api.token = accountToken ?? '';
    setToken(accountToken);
  }

  const loadAccountToken = async (accountId: string) => {
    if (accountId.length === 0) {
      return null;
    }

    return SecureStore.getItemAsync(accountId);
  }

  const saveAccountToken = async (accountId: string, accountToken: string) => {
    await SecureStore.setItemAsync(accountId, accountToken);
  }

  const saveAccount = async (user: User, token: string) => {
    const conn: Connection = {
      account_id: `${slug(user.service)}-token.${user.username ?? ''}`,
      service: user.service,
      username: user.username ?? '',
      fullname: user.fullname ?? '',
    };

    await connections.saveConnection(conn);
    await saveAccountToken(conn.account_id, token);
    setActiveAccount(conn.account_id);
  }

  return (
    <AuthContext.Provider value={{
      user,
      accountId: activeAccount,
      token,
      service,
      setUser,
      setActiveAccount,
      loadAccountToken,
      saveAccountToken,
      saveAccount
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);