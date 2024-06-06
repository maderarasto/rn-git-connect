import { createContext, useState } from "react";
import { AuthUser } from "../api/types";

export type AuthUserContextType = {
    user: AuthUser | null
    setUser: (user: AuthUser|null) => void
}

export type AuthUserProviderProps = {
    children?: React.JSX.Element | React.JSX.Element[]
}

export const AuthUserContext = createContext<AuthUserContextType|undefined>(undefined);

export const AuthUserProvider = ({
    children
}: AuthUserProviderProps) => {
    const [authUser, setAuthUser] = useState<AuthUser|null>(null);

    function setUser(user: AuthUser|null) {
        setAuthUser(user);
    }

    return (
        <AuthUserContext.Provider value={{ 
            user: authUser,
            setUser,
        }}>
            {children}        
        </AuthUserContext.Provider>
    )
}