/**
 * index.js
 * 
 * Main export file for the Stepper compound component.
 * Exports all components and context for compound pattern usage.
 * 
 * Usage:
 * import { Stepper, Step, StepList, Navigation } from './components/Stepper';
 * 
 * <Stepper>
 *   <StepList />
 *   <Step>Content 1</Step>
 *   <Step>Content 2</Step>
 *   <Navigation />
 * </Stepper>
 */

export { default as Stepper } from './Stepper';
export { default as Step } from './Step';
export { default as StepList } from './StepList';
export { default as Navigation } from './Navigation';
export { useStepper } from './StepperContext';
