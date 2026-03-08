/**
 * Form Validation Utilities - Phase 8 Implementation
 * Comprehensive validation functions for authentication forms
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Email validation
 * Checks if email is in valid format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || !email.trim()) {
    return {
      isValid: false,
      error: "Email is required",
    };
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: "Please enter a valid email address",
    };
  }

  // Check for common typos in domain
  const domain = email.split("@")[1]?.toLowerCase();
  const commonTypos: { [key: string]: string } = {
    "gmial.com": "gmail.com",
    "gmai.com": "gmail.com",
    "yahou.com": "yahoo.com",
    "yaho.com": "yahoo.com",
    "hotmial.com": "hotmail.com",
  };

  if (domain && commonTypos[domain]) {
    return {
      isValid: false,
      error: `Did you mean ${email.split("@")[0]}@${commonTypos[domain]}?`,
    };
  }

  return { isValid: true };
};

/**
 * Password validation
 * Enforces password requirements: min 8 chars, 1 number, 1 special char
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password || !password.trim()) {
    return {
      isValid: false,
      error: "Password is required",
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters long",
    };
  }

  if (!/\d/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one number",
    };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one special character",
    };
  }

  // Check for common weak passwords
  const weakPasswords = [
    "password",
    "12345678",
    "password1",
    "qwerty12",
    "admin123",
  ];

  if (weakPasswords.includes(password.toLowerCase())) {
    return {
      isValid: false,
      error: "This password is too common. Please choose a stronger password",
    };
  }

  return { isValid: true };
};

/**
 * Get password strength details
 */
export interface PasswordStrength {
  length: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  score: number; // 0-5
  label: "Very Weak" | "Weak" | "Fair" | "Good" | "Strong";
}

export const getPasswordStrength = (password: string): PasswordStrength => {
  const checks = {
    length: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
  };

  // Calculate score
  let score = 0;
  if (checks.length) score++;
  if (checks.hasNumber) score++;
  if (checks.hasSpecial) score++;
  if (checks.hasUppercase) score++;
  if (checks.hasLowercase) score++;

  // Determine label
  let label: PasswordStrength["label"];
  if (score <= 1) label = "Very Weak";
  else if (score === 2) label = "Weak";
  else if (score === 3) label = "Fair";
  else if (score === 4) label = "Good";
  else label = "Strong";

  return {
    ...checks,
    score,
    label,
  };
};

/**
 * Name validation
 * Validates first name or last name
 */
export const validateName = (
  name: string,
  fieldName: string = "Name",
): ValidationResult => {
  if (!name || !name.trim()) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: `${fieldName} must be at least 2 characters`,
    };
  }

  if (name.trim().length > 50) {
    return {
      isValid: false,
      error: `${fieldName} must be less than 50 characters`,
    };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return {
      isValid: false,
      error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`,
    };
  }

  return { isValid: true };
};

/**
 * Organization name validation
 */
export const validateOrganizationName = (name: string): ValidationResult => {
  if (!name || !name.trim()) {
    return {
      isValid: false,
      error: "Organization name is required",
    };
  }

  if (name.trim().length < 3) {
    return {
      isValid: false,
      error: "Organization name must be at least 3 characters",
    };
  }

  if (name.trim().length > 100) {
    return {
      isValid: false,
      error: "Organization name must be less than 100 characters",
    };
  }

  return { isValid: true };
};

/**
 * URL validation
 */
export const validateUrl = (url: string): ValidationResult => {
  if (!url || !url.trim()) {
    return {
      isValid: false,
      error: "Website URL is required",
    };
  }

  try {
    const urlObj = new URL(url);

    // Check if protocol is http or https
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return {
        isValid: false,
        error: "Please enter a valid HTTP or HTTPS URL",
      };
    }

    return { isValid: true };
  } catch {
    // If URL parsing fails, try to detect if user forgot protocol
    if (!url.includes("://")) {
      return {
        isValid: false,
        error: "Please include http:// or https:// in the URL",
      };
    }

    return {
      isValid: false,
      error: "Please enter a valid URL",
    };
  }
};

/**
 * Validate all signup form fields
 */
export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignupFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export const validateSignupForm = (data: SignupFormData): SignupFormErrors => {
  const errors: SignupFormErrors = {};

  const firstNameResult = validateName(data.firstName, "First name");
  if (!firstNameResult.isValid) {
    errors.firstName = firstNameResult.error;
  }

  const lastNameResult = validateName(data.lastName, "Last name");
  if (!lastNameResult.isValid) {
    errors.lastName = lastNameResult.error;
  }

  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error;
  }

  const passwordResult = validatePassword(data.password);
  if (!passwordResult.isValid) {
    errors.password = passwordResult.error;
  }

  return errors;
};

/**
 * Validate login form fields
 */
export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export const validateLoginForm = (data: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error;
  }

  if (!data.password || !data.password.trim()) {
    errors.password = "Password is required";
  }

  return errors;
};
