import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { auth } from "../src/firebase";
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";



interface AuthData {
    user: UserCredential | null;
    signUp(email: string, password: string): Promise<void>;
    logout(): void;
}



export const AuthContext = createContext<AuthData | null>(null);


export const useAuth = () => {
    return useContext(AuthContext);
}

// export function signUp() {
// }

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserCredential | null>(null);

    const value = useMemo(() => {
        const signUp = async (email: string, password: string) => {

          let response: any;

          try {
            response = await createUserWithEmailAndPassword(auth, email, password);
            setUser(user);

          } catch (error: any) {
            console.error('Unable to create account');
          }
  
        };

        const logout = () => {
            setUser(null);
        };

        return {user, signUp, logout};
    }, [user, setUser]);

    return (
        <AuthContext.Provider value={value}>
           { children }
        </AuthContext.Provider>
    )

    
}

