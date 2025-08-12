<<<<<<< HEAD
import { createContext } from "react";

export const PredictionContext = createContext();
=======
import { createContext } from 'react';

// Create the context with initial values
export const PredictionContext = createContext({
  allPredictions: [],
  db: null,
  userId: null,
});
>>>>>>> 709f5d8 (remove all admin components)
