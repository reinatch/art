'use client';

import { createContext, useContext, useState, ReactNode } from "react";

// Define the context type to include both data fetch and video ready states
interface DataFetchContextType {
  isDataFetched: boolean;
  setIsDataFetched: (state: boolean) => void;
  isVideoReady: boolean;
  setIsVideoReady: (state: boolean) => void;
}

// Create the context with an initial undefined value
const DataFetchContext = createContext<DataFetchContextType | undefined>(undefined);

// The provider component that will manage the context state
export const DataFetchProvider = ({ children }: { children: ReactNode }) => {
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false); // New state for video readiness

  return (
    <DataFetchContext.Provider
      value={{ isDataFetched, setIsDataFetched, isVideoReady, setIsVideoReady }}
    >
      {children}
    </DataFetchContext.Provider>
  );
};

// Hook to access the context in other components
export const useDataFetchContext = () => {
  const context = useContext(DataFetchContext);
  if (!context) {
    throw new Error("useDataFetchContext must be used within a DataFetchProvider");
  }
  return context;
};
