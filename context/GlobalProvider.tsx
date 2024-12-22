import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../lib/appwrite";
import { Models } from "react-native-appwrite";

export type GlobalContextType = {
  isLogged: boolean;
  user: Models.Document | null;
  loading: boolean;
  setIsLogged: (value: boolean) => void;
  setUser: (user: Models.Document | null) => void;
  setLoading: (loading: boolean) => void;
};

interface GlobalProviderProps {
  children: React.ReactNode;
}

export const GlobalContext = createContext<GlobalContextType>({
  isLogged: false,
  user: null,
  loading: true,
  setIsLogged: () => {},
  setUser: () => {},
  setLoading: () => {},
});

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [context, setContext] = useState<GlobalContextType>({
    isLogged: false,
    user: null,
    loading: true,
    setIsLogged: (value: boolean) => setContext(prev => ({ ...prev, isLogged: value })),
    setUser: (user: Models.Document | null) => setContext(prev => ({ ...prev, user })),
    setLoading: (loading: boolean) => setContext(prev => ({ ...prev, loading }))
  });

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          context.setIsLogged(true);
          context.setUser(res);
        } else {
          context.setIsLogged(false);
          context.setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        context.setLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider value={context}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
