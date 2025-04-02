"use client";
import { createContext, useContext, useState, ReactNode } from "react";
interface DataFetchContextType {
  isDataFetched: boolean;
  setIsDataFetched: (state: boolean) => void;
  isVideoReady: boolean;
  setIsVideoReady: (state: boolean) => void;
}
const DataFetchContext = createContext<DataFetchContextType | undefined>(
  undefined
);
export const DataFetchProvider = ({ children }: { children: ReactNode }) => {
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  return (
    <DataFetchContext.Provider
      value={{ isDataFetched, setIsDataFetched, isVideoReady, setIsVideoReady }}
    >
      {children}
    </DataFetchContext.Provider>
  );
};
export const useDataFetchContext = () => {
  const context = useContext(DataFetchContext);
  if (!context) {
    throw new Error(
      "useDataFetchContext must be used within a DataFetchProvider"
    );
  }
  return context;
};
