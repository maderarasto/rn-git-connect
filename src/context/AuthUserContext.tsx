import { User } from "@src/types";
import { createContext, useState } from "react";

export type AuthUserContextType = {
    user: User | null
    setUser: (user: User|null) => void
}

export type AuthUserProviderProps = {
    children?: React.JSX.Element | React.JSX.Element[]
}

export const AuthUserContext = createContext<AuthUserContextType|undefined>(undefined);

export const AuthUserProvider = ({
    children
}: AuthUserProviderProps) => {
    const [authUser, setAuthUser] = useState<User|null>(null);

    function setUser(user: User|null) {
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