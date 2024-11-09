import { User } from "@src/api/types"
import { createContext, PropsWithChildren, useContext, useState } from "react"

export type AuthContext = {
  user: User|null
  setUser: (user: User) => void
}

const AuthContext = createContext<AuthContext|null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User|null>(null);

  return (
    <AuthContext.Provider value={{
      user,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);