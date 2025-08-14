import { createContext } from "react";

export const PredictionContext = createContext({
  allPredictions: [],
  db: null,
  userId: null,
});
