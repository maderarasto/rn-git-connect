import ApiResolver from "@src/api/ApiResolver"
import { ServiceType } from "@src/api/types"
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

export type GitApiContext = {
  service: ServiceType|null
  setService?: (service: ServiceType) => void
  api?: ApiResolver
};

const GitApiContext = createContext<GitApiContext>({
  service: null
});

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [serviceType, setServiceType] = useState<ServiceType|null>(null);


  return (
    <GitApiContext.Provider value={{
      api: new ApiResolver(),
      service: serviceType,
      setService: (service: ServiceType) => {
        setServiceType(service);
      }
    }}>
      {children}
    </GitApiContext.Provider>
  );
};

export default AuthProvider;

export const useGitApi = () => useContext(GitApiContext)