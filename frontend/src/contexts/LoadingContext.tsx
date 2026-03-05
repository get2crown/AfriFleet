import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { setLoadingCallback } from '../services/api';

interface LoadingContextValue {
  loading: boolean;
}

const LoadingContext = createContext<LoadingContextValue>({ loading: false });

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // register callback so axios interceptors can report state
    setLoadingCallback((isLoading: boolean) => {
      setCount((prev) => (isLoading ? prev + 1 : Math.max(prev - 1, 0)));
    });
  }, []);

  return (
    <LoadingContext.Provider value={{ loading: count > 0 }}>
      {children}
    </LoadingContext.Provider>
  );
};

export function useLoading() {
  return useContext(LoadingContext);
}
