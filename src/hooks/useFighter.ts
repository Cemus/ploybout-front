import { useContext } from "react";
import { FighterContext, FighterContextType } from "../contexts/FighterContext";

export const useFighter = (): FighterContextType => {
  const context = useContext(FighterContext);
  if (context === undefined) {
    throw new Error("useFighter must be used within a FighterProvider");
  }
  return context;
};
