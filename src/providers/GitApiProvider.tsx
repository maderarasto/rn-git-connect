import ApiResolver from "@src/api/ApiResolver"
import { AccountType } from "@src/api/types"
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

export type GitApiContext = {
  service: AccountType|null
  setService?: (service: AccountType) => void
  api?: ApiResolver
};

const GitApiContext = createContext<GitApiContext>({
  service: null
});

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [serviceType, setServiceType] = useState<AccountType|null>(null);


  return (
    <GitApiContext.Provider value={{
      api: new ApiResolver(),
      service: serviceType,
      setService: (service: AccountType) => {
        setServiceType(service);
      }
    }}>
      {children}
    </GitApiContext.Provider>
  );
};

export default AuthProvider;

export const useGitApi = () => useContext(GitApiContext)