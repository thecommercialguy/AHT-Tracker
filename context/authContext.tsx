import { useContext, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router";



interface AuthData {
    user: string;
    login(data: string): Promise<void>;
    logout(): void;
}



export const AuthContext = createContext<AuthData | null>(null);


export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = () => {
    const [user, setUser] = useLocalStorage("user", null);

    const navigate = useNavigate();

    const value = useMemo(() => {
        const login = async (data: string) => {
            setUser(data);
            navigate("/dashboard");
        };

        const logout = () => {
            setUser(null);
            navigate("/", { replace: true });
        };

        return {user, login, logout};
    }, [user, navigate, setUser]);

    return (
        <AuthContext.Provider value={value}>
            <Outlet />
        </AuthContext.Provider>
    )

    
}




export const useLocalStorage = <T,>(
  keyName: string,
  defaultValue: T
): [string, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(
          keyName,
          JSON.stringify(defaultValue)
        );
        return defaultValue;
      }
    } catch {
      return defaultValue;
    }
  });

  const setValue = (newValue: T) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {
      console.log(err);
    }
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
};