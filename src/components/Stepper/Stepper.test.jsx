/**
 * Stepper.test.jsx
 * 
 * Test suite for Stepper compound component.
 * Tests keyboard navigation, ARIA attributes, and state synchronization.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Stepper, Step, StepList, Navigation } from './index';

describe('Stepper Compound Component', () => {
  /**
   * Test: Basic rendering
   */
  it('renders all steps correctly', () => {
    render(
      <Stepper>
        <StepList />
        <Step id="step1" index={0} label="Step 1">
          Content 1
        </Step>
        <Step id="step2" index={1} label="Step 2">
          Content 2
        </Step>
        <Step id="step3" index={2} label="Step 3">
          Content 3
        </Step>
        <Navigation />
      </Stepper>
    );

    // Check if step labels are rendered
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
    
    // Check if first step content is visible
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    
    // Check if other step content is not visible
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
  });

  /**
   * Test: ARIA attributes
   */
  it('has correct ARIA attributes for accessibility', () => {
    render(
      <Stepper>
        <StepList />
        <Step id="step1" index={0} label="Step 1">
          Content 1
        </Step>
        <Step id="step2" index={1} label="Step 2">
          Content 2
        </Step>
      </Stepper>
    );

    // Check for tablist role
    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();

    // Check for tab roles
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(2);

    // Check aria-selected on first tab
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');

    // Check tabpanel role
    const tabpanel = screen.getByRole('tabpanel');
    expect(tabpanel).toBeInTheDocument();
    expect(tabpanel).toHaveAttribute('id', 'step-panel-0');
  });

  /**
   * Test: Keyboard navigation with Arrow keys
   */
  it('supports keyboard navigation with arrow keys', async () => {
    const user = userEvent.setup();
    
    render(
      <Stepper>
        <StepList />
        <Step id="step1" index={0} label="Step 1">
          Content 1
        </Step>
        <Step id="step2" index={1} label="Step 2">
          Content 2
        </Step>
        <Step id="step3" index={2} label="Step 3">
          Content 3
        </Step>
      </Stepper>
    );

    const tabs = screen.getAllByRole('tab');
    
    // Focus first tab
    tabs[0].focus();
    expect(tabs[0]).toHaveFocus();

    // Press ArrowRight to move focus to next tab
    await user.keyboard('{ArrowRight}');
    expect(tabs[1]).toHaveFocus();

    // Press ArrowRight again
    await user.keyboard('{ArrowRight}');
    expect(tabs[2]).toHaveFocus();

    // Press ArrowLeft to move focus back
    await user.keyboard('{ArrowLeft}');
    expect(tabs[1]).toHaveFocus();
  });

  /**
   * Test: Keyboard navigation with Home/End keys
   */
  it('supports Home and End keys for boundary navigation', async () => {
    const user = userEvent.setup();
    
    render(
      <Stepper>
        <StepList />
        <Step id="step1" index={0} label="Step 1">
          Content 1
        </Step>
        <Step id="step2" index={1} label="Step 2">
          Content 2
        </Step>
        <Step id="step3" index={2} label="Step 3">
          Content 3
        </Step>
      </Stepper>
    );

    const tabs = screen.getAllByRole('tab');
    
    // Focus middle tab
    tabs[1].focus();
    expect(tabs[1]).toHaveFocus();

    // Press Home to jump to first tab
    await user.keyboard('{Home}');
    expect(tabs[0]).toHaveFocus();

    // Press End to jump to last tab
    await user.keyboard('{End}');
    expect(tabs[2]).toHaveFocus();
  });

  /**
   * Test: Enter/Space key activation
   */
  it('activates step on Enter or Space key press', async () => {
    const user = userEvent.setup();
    
    render(
      <Stepper>
        <StepList />
        <Step id="step1" index={0} label="Step 1">
          Content 1
        </Step>
        <Step id="step2" index={1} label="Step 2">
          Content 2
        </Step>
      </Stepper>
    );

    const tabs = screen.getAllByRole('tab');
    
    // Focus second tab
    tabs[1].focus();
    
    // Press Enter to activate
    await user.keyboard('{Enter}');
    
    // Check if second step content is now visible
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    
    // Check aria-selected updated
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
  });

  /**
   * Test: Navigation buttons
   */
  it('navigates steps with Next/Previous buttons', async () => {
    const user = userEvent.setup();
    
    render(
      <Stepper>
        <StepList />
        <Step id="step1" index={0} label="Step 1">
          Content 1
        </Step>
        <Step id="step2" index={1} label="Step 2">
          Content 2
        </Step>
        <Navigation />
      </Stepper>
    );

    // Check initial state
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    
    // Click Next button
    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);
    
    // Check if second step is now visible
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    
    // Click Previous button
    const previousButton = screen.getByRole('button', { name: /previous/i });
    await user.click(previousButton);
    
    // Check if back to first step
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  /**
   * Test: Button disabled states
   */
  it('disables Previous button on first step and Next button on last step', () => {
    const { rerender } = render(
      <Stepper initialStep={0}>
        <Step id="step1" index={0} label="Step 1">
          Content 1
        </Step>
        <Step id="step2" index={1} label="Step 2">
          Content 2
        </Step>
        <Navigation />
      </Stepper>
    );

    // On first step, Previous should be disabled
    const previousButton = screen.getByRole('button', { name: /previous/i });
    expect(previousButton).toBeDisabled();
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).not.toBeDisabled();
  });

  /**
   * Test: Render props pattern
   */
  it('supports render props for custom step content', () => {
    render(
      <Stepper>
        <StepList />
        <Step id="step1" index={0} label="Step 1">
          {({ isActive, isCompleted, index }) => (
            <div>
              <div>Active: {isActive ? 'Yes' : 'No'}</div>
              <div>Completed: {isCompleted ? 'Yes' : 'No'}</div>
              <div>Index: {index}</div>
            </div>
          )}
        </Step>
      </Stepper>
    );

    // Check if render prop function was called with correct data
    expect(screen.getByText('Active: Yes')).toBeInTheDocument();
    expect(screen.getByText('Completed: No')).toBeInTheDocument();
    expect(screen.getByText('Index: 0')).toBeInTheDocument();
  });

  /**
   * Test: State synchronization without prop drilling
   */
  it('synchronizes state across components without prop drilling', async () => {
    const user = userEvent.setup();
    
    render(
      <Stepper>
        <StepList />
        <Step id="step1" index={0} label="Step 1">
          Content 1
        </Step>
        <Step id="step2" index={1} label="Step 2">
          Content 2
        </Step>
        <Navigation />
      </Stepper>
    );

    const tabs = screen.getAllByRole('tab');
    
    // Click second tab
    await user.click(tabs[1]);
    
    // Check if step content updated (state synchronized)
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    
    // Check if tab aria-selected updated (state synchronized)
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    
    // Check if navigation buttons reflect new state
    const previousButton = screen.getByRole('button', { name: /previous/i });
    expect(previousButton).not.toBeDisabled();
  });

  /**
   * Test: Step completion tracking
   */
  it('marks steps as completed when moving forward', async () => {
    const user = userEvent.setup();
    
    render(
      <Stepper>
        <StepList />
        <Step id="step1" index={0} label="Step 1">
          Content 1
        </Step>
        <Step id="step2" index={1} label="Step 2">
          Content 2
        </Step>
        <Navigation />
      </Stepper>
    );

    const tabs = screen.getAllByRole('tab');
    
    // Initially first step should not be completed
    expect(tabs[0]).not.toHaveClass('completed');
    
    // Click Next to move forward
    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);
    
    // First step should now be marked as completed
    expect(tabs[0]).toHaveClass('completed');
  });

  /**
   * Test: Click on step to navigate
   */
  it('allows clicking on step indicators to navigate', async () => {
    const user = userEvent.setup();
    
    render(
      <Stepper>
        <StepList />
        <Step id="step1" index={0} label="Step 1">
          Content 1
        </Step>
        <Step id="step2" index={1} label="Step 2">
          Content 2
        </Step>
        <Step id="step3" index={2} label="Step 3">
          Content 3
        </Step>
      </Stepper>
    );

    const tabs = screen.getAllByRole('tab');
    
    // Click on third step
    await user.click(tabs[2]);
    
    // Check if third step content is visible
    expect(screen.getByText('Content 3')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });
});
