import { createContext } from 'react';

// Create the context with initial values
export const PredictionContext = createContext({
  allPredictions: [],
  db: null,
  userId: null,
});
