/**
 * App.jsx
 * 
 * Demo application showcasing the Stepper compound component.
 * Demonstrates:
 * 1. Compound Components pattern
 * 2. Render props for customization
 * 3. State synchronization without prop drilling
 * 4. Keyboard navigation and ARIA attributes
 */

import { useState } from 'react';
import { Stepper, Step, StepList, Navigation } from './components/Stepper';
import './App.css';

function App() {
  // Form state for multi-step form example
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    
    // Contact Details
    phone: '',
    address: '',
    city: '',
    
    // Preferences
    notifications: true,
    newsletter: false,
    theme: 'light',
  });

  /**
   * Update form data
   */
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Form submitted successfully! Check console for data.');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>React Stepper Component</h1>
        <p className="subtitle">
          Compound Components Pattern with Render Props & Full A11y Support
        </p>
      </header>

      <main className="app-main">
        {/* Example 1: Multi-step Form with Compound Components */}
        <section className="demo-section">
          <h2>Multi-Step User Registration Form</h2>
          <p className="demo-description">
            Demonstrates compound components pattern with full keyboard navigation (Arrow keys, Tab, Enter) 
            and ARIA attributes for accessibility.
          </p>

          <Stepper initialStep={0}>
            {/* Step indicators with keyboard navigation */}
            <StepList />

            {/* Step 1: Personal Information */}
            <Step 
              id="personal-info" 
              index={0} 
              label="Personal Info"
            >
              <div className="form-step">
                <h3>Personal Information</h3>
                <p className="step-description">Enter your basic information</p>
                
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    placeholder="John"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="Doe"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="john.doe@example.com"
                  />
                </div>
              </div>
            </Step>

            {/* Step 2: Contact Details - Using render props pattern */}
            <Step 
              id="contact-details" 
              index={1} 
              label="Contact Details"
            >
              {({ isActive, isCompleted }) => (
                <div className="form-step">
                  <h3>Contact Details</h3>
                  <p className="step-description">
                    {isCompleted ? '✓ Contact information saved' : 'Provide your contact information'}
                  </p>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Street Address</label>
                    <input
                      id="address"
                      type="text"
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      placeholder="123 Main St"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="New York"
                    />
                  </div>

                  {/* This demonstrates render props - we have access to step state */}
                  {isActive && (
                    <div className="info-box">
                      <strong>Render Props Example:</strong> This content is conditionally 
                      rendered based on the step's active state passed via render props.
                    </div>
                  )}
                </div>
              )}
            </Step>

            {/* Step 3: Preferences */}
            <Step 
              id="preferences" 
              index={2} 
              label="Preferences"
            >
              <div className="form-step">
                <h3>Your Preferences</h3>
                <p className="step-description">Customize your experience</p>
                
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.notifications}
                      onChange={(e) => updateField('notifications', e.target.checked)}
                    />
                    <span>Enable email notifications</span>
                  </label>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.newsletter}
                      onChange={(e) => updateField('newsletter', e.target.checked)}
                    />
                    <span>Subscribe to newsletter</span>
                  </label>
                </div>

                <div className="form-group">
                  <label htmlFor="theme">Preferred Theme</label>
                  <select
                    id="theme"
                    value={formData.theme}
                    onChange={(e) => updateField('theme', e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>
            </Step>

            {/* Step 4: Review - Demonstrates render props with full state */}
            <Step 
              id="review" 
              index={3} 
              label="Review"
            >
              {({ isActive }) => (
                <div className="form-step">
                  <h3>Review Your Information</h3>
                  <p className="step-description">Please verify all details before submitting</p>
                  
                  <div className="review-section">
                    <h4>Personal Information</h4>
                    <dl>
                      <dt>Name:</dt>
                      <dd>{formData.firstName} {formData.lastName}</dd>
                      <dt>Email:</dt>
                      <dd>{formData.email}</dd>
                    </dl>
                  </div>

                  <div className="review-section">
                    <h4>Contact Details</h4>
                    <dl>
                      <dt>Phone:</dt>
                      <dd>{formData.phone || 'Not provided'}</dd>
                      <dt>Address:</dt>
                      <dd>{formData.address || 'Not provided'}</dd>
                      <dt>City:</dt>
                      <dd>{formData.city || 'Not provided'}</dd>
                    </dl>
                  </div>

                  <div className="review-section">
                    <h4>Preferences</h4>
                    <dl>
                      <dt>Notifications:</dt>
                      <dd>{formData.notifications ? 'Enabled' : 'Disabled'}</dd>
                      <dt>Newsletter:</dt>
                      <dd>{formData.newsletter ? 'Subscribed' : 'Not subscribed'}</dd>
                      <dt>Theme:</dt>
                      <dd>{formData.theme}</dd>
                    </dl>
                  </div>

                  {isActive && (
                    <button 
                      className="submit-btn"
                      onClick={handleSubmit}
                    >
                      Submit Registration
                    </button>
                  )}
                </div>
              )}
            </Step>

            {/* Navigation with custom slot rendering */}
            <Navigation 
              renderNext={({ onClick, disabled, isLastStep }) => (
                <button
                  className={`stepper-btn stepper-btn-next ${isLastStep ? 'last-step' : ''}`}
                  onClick={onClick}
                  disabled={disabled}
                >
                  {isLastStep ? '✓ Complete' : 'Next Step →'}
                </button>
              )}
            />
          </Stepper>
        </section>

        {/* Features Overview */}
        <section className="features-section">
          <h2>Component Features</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <h3>🔧 Compound Components</h3>
              <p>
                Full encapsulation with high API flexibility. Components work together 
                through shared context without prop drilling.
              </p>
              <code>&lt;Stepper&gt;&lt;Step&gt;...&lt;/Step&gt;&lt;/Stepper&gt;</code>
            </div>

            <div className="feature-card">
              <h3>🎨 Render Props & Slots</h3>
              <p>
                Customize step content with render props pattern. Pass functions as children 
                to access step state and customize rendering.
              </p>
              <code>{`{({ isActive }) => <div>...</div>}`}</code>
            </div>

            <div className="feature-card">
              <h3>🔄 State Synchronization</h3>
              <p>
                Internal state management via Context API. No prop drilling required - 
                all components sync automatically.
              </p>
              <code>useStepper() hook</code>
            </div>

            <div className="feature-card">
              <h3>⌨️ Keyboard Navigation</h3>
              <p>
                Full keyboard support: Arrow keys for navigation, Tab for focus management, 
                Enter/Space to activate, Home/End for boundaries.
              </p>
              <code>ARIA + Keyboard handlers</code>
            </div>

            <div className="feature-card">
              <h3>♿ Accessibility (A11y)</h3>
              <p>
                Complete ARIA attributes: role="tablist", aria-selected, aria-controls, 
                aria-labelledby for screen reader support.
              </p>
              <code>Full ARIA implementation</code>
            </div>

            <div className="feature-card">
              <h3>📦 Industrial Grade</h3>
              <p>
                Production-ready component with proper focus management, keyboard navigation, 
                accessibility, and comprehensive documentation.
              </p>
              <code>Ready for real-world use</code>
            </div>
          </div>
        </section>

        {/* Keyboard shortcuts guide */}
        <section className="keyboard-guide">
          <h2>Keyboard Shortcuts</h2>
          <div className="shortcuts-grid">
            <div className="shortcut">
              <kbd>Tab</kbd> / <kbd>Shift + Tab</kbd>
              <span>Navigate focus between elements</span>
            </div>
            <div className="shortcut">
              <kbd>←</kbd> / <kbd>→</kbd>
              <span>Navigate between steps</span>
            </div>
            <div className="shortcut">
              <kbd>Enter</kbd> / <kbd>Space</kbd>
              <span>Activate focused step</span>
            </div>
            <div className="shortcut">
              <kbd>Home</kbd> / <kbd>End</kbd>
              <span>Jump to first/last step</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>
          Built with React + Vite | Compound Components Pattern | Full A11y Support
        </p>
      </footer>
    </div>
  );
}

export default App;
