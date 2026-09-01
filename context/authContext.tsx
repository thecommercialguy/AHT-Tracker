import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { auth } from "../src/firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, type User, type UserCredential } from "firebase/auth";
import { FirebaseError } from "firebase/app";



interface AuthState {
    user: User | null;
    initializing: boolean;
}

export const AuthContext = createContext<AuthState | null>(null);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<AuthState | null>({ user: null, initializing: true });

    useEffect(() => onAuthStateChanged(auth, (user) => {
      setState({user: user, initializing: false });
    }), [])

    return (
        <AuthContext.Provider value={state}>
           { children }
        </AuthContext.Provider>
    )

    
}


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");

  return context;
}

interface ICreateUserAuthError {
  code: number;
  message: string;
}

interface ICreateUserAuthResponse {
  data: UserCredential | null;
  error: ICreateUserAuthError | null;
}

export async function createUserAuth(email: string, password: string): Promise<ICreateUserAuthResponse> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      data: userCredential,
      error: null
    };
  } catch (error) {
    let erroData = {
      code: 400,
      message: 'error creating user'
    };

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/email-already-exists":
          erroData.code = 409;
          erroData.message = 'email already exists'
          break;
        case "auth/invalid-password":
          erroData.message = 'invalid password'
          break;
      }
    }

    return {
      data: null,
      error: erroData
    };

  }

}

export async function loginUserAuth(email: string, password: string): Promise<ICreateUserAuthResponse> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      data: userCredential,
      error: null
    };
  } catch (error) {
    let erroData = {
      code: 400,
      message: 'unable to sign in'
    };

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/email-already-exists":
          erroData.code = 409;
          erroData.message = 'email already exists'
          break;
      }
    }

    return {
      data: null,
      error: erroData
    };

  }

}







