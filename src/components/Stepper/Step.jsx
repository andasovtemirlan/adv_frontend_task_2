/**
 * Step.jsx
 * 
 * Individual step component with render props support.
 * Consumes stepper context for state without prop drilling.
 * Implements render props pattern for content customization.
 */

import { useEffect, useRef } from 'react';
import { useStepper } from './StepperContext';

/**
 * Step - Child component that renders step content
 * 
 * Supports both render props and regular children for flexibility.
 * Uses context to access stepper state without prop drilling.
 * 
 * @param {Object} props
 * @param {React.ReactNode|Function} props.children - Content or render function
 * @param {string} props.label - Step label for navigation
 * @param {number} props.index - Step index (required for ordering)
 * @param {string} props.id - Unique step identifier
 * @param {Function} props.onEnter - Callback when step becomes active (optional)
 * @param {Function} props.onExit - Callback when leaving step (optional)
 */
const Step = ({ 
  children, 
  label = 'Step',
  index,
  id,
  onEnter,
  onExit,
}) => {
  const { 
    currentStep, 
    registerStep, 
    unregisterStep,
    isStepCompleted,
  } = useStepper();
  
  const stepRef = useRef(null);
  const isActive = currentStep === index;
  const isCompleted = isStepCompleted(index);
  const previousActiveState = useRef(isActive);

  // Register step on mount, unregister on unmount
  useEffect(() => {
    registerStep(id, { label, index });
    
    return () => {
      unregisterStep(id);
    };
  }, [id, label, index, registerStep, unregisterStep]);

  // Call lifecycle callbacks when step becomes active/inactive
  useEffect(() => {
    if (isActive && !previousActiveState.current && onEnter) {
      onEnter();
    } else if (!isActive && previousActiveState.current && onExit) {
      onExit();
    }
    previousActiveState.current = isActive;
  }, [isActive, onEnter, onExit]);

  // Only render active step content
  if (!isActive) {
    return null;
  }

  /**
   * Render props pattern implementation
   * If children is a function, call it with step data
   * Otherwise, render children normally
   */
  const renderContent = () => {
    // Render props pattern - pass step state to render function
    if (typeof children === 'function') {
      return children({
        isActive,
        isCompleted,
        index,
        label,
        stepRef,
      });
    }
    
    // Default rendering - just render children
    return children;
  };

  return (
    <div
      ref={stepRef}
      className="step-content"
      role="tabpanel"
      id={`step-panel-${index}`}
      aria-labelledby={`step-${index}`}
      tabIndex={0}
    >
      {renderContent()}
    </div>
  );
};

export default Step;
