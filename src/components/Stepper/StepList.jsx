/**
 * StepList.jsx
 * 
 * Renders step indicators/headers with keyboard navigation and ARIA support.
 * Consumes stepper context for state synchronization.
 * Implements full accessibility with keyboard navigation and ARIA attributes.
 */

import { useRef, useEffect } from 'react';
import { useStepper } from './StepperContext';

/**
 * StepList - Compound component that renders step indicators
 * 
 * Displays clickable step headers with accessibility support.
 * Implements keyboard navigation (Arrow keys, Home, End).
 * Uses ARIA attributes for screen reader support.
 * 
 * @param {Object} props
 * @param {Function} props.renderStep - Custom render function for step items (optional)
 * @param {string} props.className - Additional CSS classes
 */
const StepList = ({ renderStep, className = '' }) => {
  const { 
    currentStep, 
    setCurrentStep, 
    steps,
    isStepCompleted,
  } = useStepper();
  
  const stepRefs = useRef([]);

  // Focus management - focus current step when it changes
  useEffect(() => {
    if (stepRefs.current[currentStep]) {
      stepRefs.current[currentStep].focus();
    }
  }, [currentStep]);

  /**
   * Keyboard navigation handler
   * Implements accessibility requirements:
   * - ArrowLeft/ArrowRight: Navigate between steps
   * - Home: Go to first step
   * - End: Go to last step
   * - Enter/Space: Activate focused step
   */
  const handleKeyDown = (e, index) => {
    let newIndex = index;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = index > 0 ? index - 1 : index;
        break;
      
      case 'ArrowRight':
        e.preventDefault();
        newIndex = index < steps.length - 1 ? index + 1 : index;
        break;
      
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      
      case 'End':
        e.preventDefault();
        newIndex = steps.length - 1;
        break;
      
      case 'Enter':
      case ' ':
        e.preventDefault();
        setCurrentStep(index);
        return;
      
      default:
        return;
    }

    // Move focus to new step (but don't activate it)
    if (newIndex !== index && stepRefs.current[newIndex]) {
      stepRefs.current[newIndex].focus();
    }
  };

  /**
   * Click handler for step navigation
   */
  const handleStepClick = (index) => {
    setCurrentStep(index);
  };

  /**
   * Default step renderer
   */
  const defaultRenderStep = (step, index) => {
    const isActive = currentStep === index;
    const isCompleted = isStepCompleted(index);
    
    return (
      <div
        key={step.id}
        ref={el => stepRefs.current[index] = el}
        className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
        role="tab"
        aria-selected={isActive}
        aria-controls={`step-panel-${index}`}
        id={`step-${index}`}
        tabIndex={isActive ? 0 : -1}
        onClick={() => handleStepClick(index)}
        onKeyDown={(e) => handleKeyDown(e, index)}
      >
        <div className="step-indicator">
          <span className="step-number">
            {isCompleted ? '✓' : index + 1}
          </span>
        </div>
        <div className="step-label">{step.label}</div>
      </div>
    );
  };

  return (
    <div 
      className={`step-list ${className}`}
      role="tablist"
      aria-label="Form steps"
    >
      {steps.map((step, index) => 
        renderStep 
          ? renderStep(step, index, { 
              isActive: currentStep === index,
              isCompleted: isStepCompleted(index),
              onClick: () => handleStepClick(index),
              onKeyDown: (e) => handleKeyDown(e, index),
            })
          : defaultRenderStep(step, index)
      )}
    </div>
  );
};

export default StepList;
