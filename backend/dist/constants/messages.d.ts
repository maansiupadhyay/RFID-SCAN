export declare const MESSAGES: {
    readonly AUTH: {
        readonly REGISTER_SUCCESS: "User registered successfully";
        readonly LOGIN_SUCCESS: "Login successful";
        readonly INVALID_CREDENTIALS: "Invalid email or password";
        readonly EMAIL_EXISTS: "Email already registered";
        readonly UNAUTHORIZED: "Unauthorized - Please login";
        readonly FORBIDDEN: "Forbidden - Insufficient permissions";
        readonly TOKEN_INVALID: "Invalid or expired token";
        readonly TOKEN_MISSING: "Access token is required";
    };
    readonly TOOL: {
        readonly CREATED: "Tool created successfully";
        readonly UPDATED: "Tool updated successfully";
        readonly DELETED: "Tool deleted successfully";
        readonly FETCHED: "Tool fetched successfully";
        readonly LIST_FETCHED: "Tools fetched successfully";
        readonly NOT_FOUND: "Tool not found";
        readonly CODE_EXISTS: "Tool code already exists";
    };
    readonly TRANSACTION: {
        readonly ISSUED: "Tool issued successfully";
        readonly RETURNED: "Tool returned successfully";
        readonly HISTORY_FETCHED: "Transaction history fetched successfully";
        readonly ALREADY_ISSUED: "Tool is already issued and not available";
        readonly NOT_ISSUED: "Tool is not currently issued, cannot return";
        readonly TOOL_MISSING: "Tool is marked as missing and cannot be issued";
    };
    readonly SCAN: {
        readonly COMPLETED: "RFID scan completed successfully";
        readonly HISTORY_FETCHED: "Scan history fetched successfully";
        readonly INVALID_INPUT: "Please provide an array of scanned tool IDs";
        readonly EMPTY_INPUT: "Scanned IDs array cannot be empty";
    };
    readonly DASHBOARD: {
        readonly STATS_FETCHED: "Dashboard statistics fetched successfully";
    };
    readonly GENERAL: {
        readonly SERVER_ERROR: "Internal server error";
        readonly VALIDATION_ERROR: "Validation error";
        readonly NOT_FOUND: "Resource not found";
    };
};
//# sourceMappingURL=messages.d.ts.map