/**
 * Stepper.jsx
 * 
 * Main compound component that provides context to all child components.
 * Manages internal state for current step, completed steps, and step navigation.
 * Implements the Compound Component pattern for high API flexibility.
 */

import { useState, useCallback, useMemo } from 'react';
import { StepperContext } from './StepperContext';
import './Stepper.css';

/**
 * Stepper - Parent compound component
 * 
 * Provides state management and context to child components without prop drilling.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components (Step, StepList, Navigation)
 * @param {number} props.initialStep - Starting step index (default: 0)
 * @param {Function} props.onStepChange - Callback when step changes (optional)
 * @param {string} props.className - Additional CSS classes
 */
const Stepper = ({ 
  children, 
  initialStep = 0, 
  onStepChange,
  className = '' 
}) => {
  // Internal state management without prop drilling
  const [currentStep, setCurrentStepState] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [steps, setSteps] = useState([]);

  /**
   * Register a step when it mounts
   * Used by Step components to register themselves in the stepper
   */
  const registerStep = useCallback((stepId, stepData) => {
    setSteps(prev => {
      const existing = prev.find(s => s.id === stepId);
      if (existing) return prev;
      return [...prev, { id: stepId, ...stepData }].sort((a, b) => a.index - b.index);
    });
  }, []);

  /**
   * Unregister a step when it unmounts
   */
  const unregisterStep = useCallback((stepId) => {
    setSteps(prev => prev.filter(s => s.id !== stepId));
  }, []);

  /**
   * Navigate to a specific step
   * Synchronizes internal state across all components
   */
  const goToStep = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStepState(stepIndex);
      if (onStepChange) {
        onStepChange(stepIndex);
      }
    }
  }, [steps.length, onStepChange]);

  /**
   * Navigate to next step
   */
  const goToNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      // Mark current step as completed when moving forward
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      goToStep(currentStep + 1);
    }
  }, [currentStep, steps.length, goToStep]);

  /**
   * Navigate to previous step
   */
  const goToPrevious = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  /**
   * Mark a step as completed
   */
  const markStepCompleted = useCallback((stepIndex) => {
    setCompletedSteps(prev => new Set([...prev, stepIndex]));
  }, []);

  /**
   * Check if a step is completed
   */
  const isStepCompleted = useCallback((stepIndex) => {
    return completedSteps.has(stepIndex);
  }, [completedSteps]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    currentStep,
    setCurrentStep: goToStep,
    goToNext,
    goToPrevious,
    steps,
    registerStep,
    unregisterStep,
    completedSteps,
    markStepCompleted,
    isStepCompleted,
    totalSteps: steps.length,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
  }), [
    currentStep,
    goToStep,
    goToNext,
    goToPrevious,
    steps,
    registerStep,
    unregisterStep,
    completedSteps,
    markStepCompleted,
    isStepCompleted,
  ]);

  return (
    <StepperContext.Provider value={contextValue}>
      <div className={`stepper ${className}`}>
        {children}
      </div>
    </StepperContext.Provider>
  );
};

export default Stepper;
