/**
 * Navigation.jsx
 * 
 * Navigation controls for stepper (Previous/Next buttons).
 * Consumes stepper context without prop drilling.
 * Supports custom button rendering through slots/render props.
 */

import { useStepper } from './StepperContext';

/**
 * Navigation - Compound component for step navigation controls
 * 
 * Provides Previous/Next buttons with customization through slots.
 * Automatically disables buttons at boundaries (first/last step).
 * 
 * @param {Object} props
 * @param {Function} props.renderPrevious - Custom render for previous button (slot pattern)
 * @param {Function} props.renderNext - Custom render for next button (slot pattern)
 * @param {Function} props.onNext - Custom next handler (optional)
 * @param {Function} props.onPrevious - Custom previous handler (optional)
 * @param {string} props.className - Additional CSS classes
 */
const Navigation = ({ 
  renderPrevious,
  renderNext,
  onNext,
  onPrevious,
  className = '',
}) => {
  const { 
    goToNext, 
    goToPrevious, 
    isFirstStep,
    isLastStep,
    currentStep,
    totalSteps,
  } = useStepper();

  /**
   * Handle previous button click
   */
  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious(currentStep);
    }
    goToPrevious();
  };

  /**
   * Handle next button click
   */
  const handleNext = () => {
    if (onNext) {
      onNext(currentStep);
    }
    goToNext();
  };

  /**
   * Default previous button renderer
   */
  const defaultPreviousButton = () => (
    <button
      className="stepper-btn stepper-btn-previous"
      onClick={handlePrevious}
      disabled={isFirstStep}
      aria-label="Go to previous step"
    >
      Previous
    </button>
  );

  /**
   * Default next button renderer
   */
  const defaultNextButton = () => (
    <button
      className="stepper-btn stepper-btn-next"
      onClick={handleNext}
      disabled={isLastStep}
      aria-label="Go to next step"
    >
      {isLastStep ? 'Finish' : 'Next'}
    </button>
  );

  return (
    <div className={`stepper-navigation ${className}`}>
      {/* Slot pattern for custom button rendering */}
      {renderPrevious 
        ? renderPrevious({ 
            onClick: handlePrevious, 
            disabled: isFirstStep,
            currentStep,
          })
        : defaultPreviousButton()
      }
      
      {renderNext
        ? renderNext({ 
            onClick: handleNext, 
            disabled: isLastStep,
            isLastStep,
            currentStep,
          })
        : defaultNextButton()
      }
    </div>
  );
};

export default Navigation;
