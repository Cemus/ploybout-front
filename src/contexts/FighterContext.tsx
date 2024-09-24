import React, { createContext, useState, ReactNode } from "react";
import { FighterInterface } from "../types/types";

export interface FighterContextType {
  fighters: FighterInterface[] | null;
  setFighters: React.Dispatch<React.SetStateAction<FighterInterface[] | null>>;
  currentFighter: number;
  setCurrentFighter: React.Dispatch<React.SetStateAction<number>>;
  selectedFighter: FighterInterface | null;
  setSelectedFighter: React.Dispatch<
    React.SetStateAction<FighterInterface | null>
  >;
}

export const FighterContext = createContext<FighterContextType | undefined>(
  undefined
);

export const FighterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [fighters, setFighters] = useState<FighterInterface[] | null>(null);
  const [currentFighter, setCurrentFighter] = useState<number>(0);
  const [selectedFighter, setSelectedFighter] =
    useState<FighterInterface | null>(null);

  return (
    <FighterContext.Provider
      value={{
        fighters,
        setFighters,
        currentFighter,
        setCurrentFighter,
        selectedFighter,
        setSelectedFighter,
      }}
    >
      {children}
    </FighterContext.Provider>
  );
};
