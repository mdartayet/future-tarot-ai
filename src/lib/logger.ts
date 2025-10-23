/**
 * Production-safe logging utility
 * - Debug logs only appear in development
 * - Error logs are sanitized in production
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  /**
   * Debug logging - only shows in development
   */
  debug: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(message, data);
    }
  },

  /**
   * Error logging - sanitized in production
   */
  error: (message: string, error?: any) => {
    if (isDevelopment) {
      console.error(message, error);
    } else {
      // Sanitize error for production
      const sanitizedError = error instanceof Error 
        ? { message: error.message, name: error.name }
        : 'Error occurred';
      console.error(message, sanitizedError);
    }
  },

  /**
   * Info logging - always shows but sanitized
   */
  info: (message: string) => {
    console.log(message);
  }
};
