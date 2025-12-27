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

  // Validation errors
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  /**
   * Validate email format
   */
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  /**
   * Validate phone format (basic)
   */
  const isValidPhone = (phone) => {
    return /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  /**
   * Validate current step
   */
  const validateStep = (stepIndex) => {
    const newErrors = {};

    if (stepIndex === 0) {
      // Personal Information validation
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!isValidEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (stepIndex === 1) {
      // Contact Details validation
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!isValidPhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number (at least 10 digits)';
      }
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Update form data
   */
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Mark field as touched
   */
  const handleBlur = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
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
        <h1>Multi-Step Form</h1>
        <p className="subtitle">
          User Registration Example
        </p>
      </header>

      <main className="app-main">
        <section className="demo-section">
          <h2>User Registration</h2>
          <p className="demo-description">
            Please complete all steps to register your account.
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
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    onBlur={() => handleBlur('firstName')}
                    placeholder="Palenshe"
                    className={errors.firstName && touchedFields.firstName ? 'error' : ''}
                  />
                  {errors.firstName && touchedFields.firstName && (
                    <span className="error-message">{errors.firstName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    onBlur={() => handleBlur('lastName')}
                    placeholder="Palenshiev"
                    className={errors.lastName && touchedFields.lastName ? 'error' : ''}
                  />
                  {errors.lastName && touchedFields.lastName && (
                    <span className="error-message">{errors.lastName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="palenshe.palenshiev@example.com"
                    className={errors.email && touchedFields.email ? 'error' : ''}
                  />
                  {errors.email && touchedFields.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
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
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      placeholder="+7 (777) 777-77-77"
                      className={errors.phone && touchedFields.phone ? 'error' : ''}
                    />
                    {errors.phone && touchedFields.phone && (
                      <span className="error-message">{errors.phone}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Street Address *</label>
                    <input
                      id="address"
                      type="text"
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      onBlur={() => handleBlur('address')}
                      placeholder="123 Main St"
                      className={errors.address && touchedFields.address ? 'error' : ''}
                    />
                    {errors.address && touchedFields.address && (
                      <span className="error-message">{errors.address}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      id="city"
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      onBlur={() => handleBlur('city')}
                      placeholder="New York"
                      className={errors.city && touchedFields.city ? 'error' : ''}
                    />
                    {errors.city && touchedFields.city && (
                      <span className="error-message">{errors.city}</span>
                    )}
                  </div>

                  {isActive && isCompleted && (
                    <div className="info-box">
                      Your contact information has been saved.
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

            {/* Navigation with validation */}
            <Navigation 
              onNext={(currentStep) => {
                // Validate before moving to next step
                const isValid = validateStep(currentStep);
                if (!isValid) {
                  // Mark all fields as touched to show errors
                  if (currentStep === 0) {
                    setTouchedFields({
                      firstName: true,
                      lastName: true,
                      email: true,
                    });
                  } else if (currentStep === 1) {
                    setTouchedFields({
                      phone: true,
                      address: true,
                      city: true,
                    });
                  }
                  return false; // Prevent navigation
                }
              }}
              renderNext={({ onClick, disabled, isLastStep, currentStep }) => {
                const handleClick = () => {
                  if (currentStep < 2) {
                    const isValid = validateStep(currentStep);
                    if (!isValid) {
                      if (currentStep === 0) {
                        setTouchedFields({
                          firstName: true,
                          lastName: true,
                          email: true,
                        });
                      } else if (currentStep === 1) {
                        setTouchedFields({
                          phone: true,
                          address: true,
                          city: true,
                        });
                      }
                      return;
                    }
                  }
                  onClick();
                };

                return (
                  <button
                    className={`stepper-btn stepper-btn-next ${isLastStep ? 'last-step' : ''}`}
                    onClick={handleClick}
                    disabled={disabled}
                  >
                    {isLastStep ? 'Complete' : 'Next Step'}
                  </button>
                );
              }}
            />
          </Stepper>
        </section>
      </main>

      <footer className="app-footer">
        <p>
          Advanced Frontend Development - Assignment 2
        </p>
      </footer>
    </div>
  );
}

export default App;
