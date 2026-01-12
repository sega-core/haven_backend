export interface ApiErrorResponse {
  error: {
    type: string;
    message: string;
    details?: any;
    stack?: string;
    timestamp?: string;
  };
}

export type ErrorType = 
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'FOREIGN_KEY_CONSTRAINT'
  | 'UNIQUE_CONSTRAINT'
  | 'DATABASE_ERROR'
  | 'INTERNAL_ERROR';