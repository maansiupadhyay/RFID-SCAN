export const MESSAGES = {
  // Auth
  AUTH: {
    REGISTER_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'Email already registered',
    UNAUTHORIZED: 'Unauthorized - Please login',
    FORBIDDEN: 'Forbidden - Insufficient permissions',
    TOKEN_INVALID: 'Invalid or expired token',
    TOKEN_MISSING: 'Access token is required',
  },

  // Tools
  TOOL: {
    CREATED: 'Tool created successfully',
    UPDATED: 'Tool updated successfully',
    DELETED: 'Tool deleted successfully',
    FETCHED: 'Tool fetched successfully',
    LIST_FETCHED: 'Tools fetched successfully',
    NOT_FOUND: 'Tool not found',
    CODE_EXISTS: 'Tool code already exists',
  },

  // Transactions
  TRANSACTION: {
    ISSUED: 'Tool issued successfully',
    RETURNED: 'Tool returned successfully',
    HISTORY_FETCHED: 'Transaction history fetched successfully',
    ALREADY_ISSUED: 'Tool is already issued and not available',
    NOT_ISSUED: 'Tool is not currently issued, cannot return',
    TOOL_MISSING: 'Tool is marked as missing and cannot be issued',
  },

  // Scans
  SCAN: {
    COMPLETED: 'RFID scan completed successfully',
    HISTORY_FETCHED: 'Scan history fetched successfully',
    INVALID_INPUT: 'Please provide an array of scanned tool IDs',
    EMPTY_INPUT: 'Scanned IDs array cannot be empty',
  },

  // Dashboard
  DASHBOARD: {
    STATS_FETCHED: 'Dashboard statistics fetched successfully',
  },

  // General
  GENERAL: {
    SERVER_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation error',
    NOT_FOUND: 'Resource not found',
  },
} as const;
