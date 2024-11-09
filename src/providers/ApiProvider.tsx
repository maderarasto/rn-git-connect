import ApiResolver from "@src/api/ApiResolver"
import { AccountType } from "@src/api/types"
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

export type GitApiContext = {
  service: AccountType|null
  setService?: (service: AccountType) => void
  api?: ApiResolver
};

const apiResolver = new ApiResolver();
const ApiContext = createContext<GitApiContext>({
  service: null,
  api: apiResolver,
});

const ApiProvider = ({ children }: PropsWithChildren) => {
  const [service, setService] = useState<AccountType|null>(null);

  useEffect(() => {
    if (!service) {
      return;
    }

    apiResolver.activeService = service;
  }, [service]);

  return (
    <ApiContext.Provider value={{
      service,
      setService,
      api: apiResolver
    }}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;

export const useApi = () => useContext(ApiContext)