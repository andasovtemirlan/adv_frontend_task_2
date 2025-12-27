/**
 * StepperContext.jsx
 * 
 * Context for managing stepper state without prop drilling.
 * This provides internal state synchronization across all child components.
 */

import { createContext, useContext } from 'react';

/**
 * Context to share stepper state between compound components
 * Contains: currentStep, setCurrentStep, steps, registerStep, completedSteps
 */
export const StepperContext = createContext(null);

/**
 * Custom hook to access stepper context
 * Throws error if used outside of Stepper component (compound component pattern)
 * 
 * @returns {Object} Stepper context value
 * @throws {Error} If used outside Stepper provider
 */
export const useStepper = () => {
  const context = useContext(StepperContext);
  
  if (!context) {
    throw new Error('useStepper must be used within a Stepper component');
  }
  
  return context;
};
