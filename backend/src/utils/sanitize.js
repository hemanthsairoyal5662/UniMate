/**
 * Sanitize user input to prevent injection attacks
 * This removes potentially dangerous characters from strings
 */
export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    // Remove special MongoDB operators and potentially dangerous characters
    return input.replace(/[${}]/g, '');
  }
  return input;
};

/**
 * Sanitize an object recursively
 */
export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return sanitizeInput(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Don't allow keys starting with $
    if (!key.startsWith('$')) {
      sanitized[key] = sanitizeObject(value);
    }
  }
  return sanitized;
};

/**
 * Validate and sanitize query parameters
 */
export const sanitizeQuery = (query) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};
