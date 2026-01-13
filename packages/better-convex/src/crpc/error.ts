/**
 * Client error codes (subset of CRPC codes for client-side use)
 */
type ClientErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'BAD_REQUEST'
  | 'TOO_MANY_REQUESTS';

/**
 * Client-side CRPC error.
 * Mirrors backend CRPCError pattern with typed error codes.
 */
export class CRPCClientError extends Error {
  readonly name = 'CRPCClientError';
  readonly code: ClientErrorCode;
  readonly functionName: string;

  constructor(opts: {
    code: ClientErrorCode;
    functionName: string;
    message?: string;
  }) {
    super(opts.message ?? `${opts.code}: ${opts.functionName}`);
    this.code = opts.code;
    this.functionName = opts.functionName;
  }
}

/** Type guard for CRPCClientError */
export const isCRPCClientError = (error: unknown): error is CRPCClientError =>
  error instanceof CRPCClientError;

/** Type guard for specific error code */
export const isCRPCErrorCode = (
  error: unknown,
  code: ClientErrorCode
): error is CRPCClientError => isCRPCClientError(error) && error.code === code;

/** Default unauthorized detection - checks UNAUTHORIZED code */
export const defaultIsUnauthorized = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;

  // Check for CRPCError/ConvexError with data.code
  if ('data' in error) {
    const data = (error as { data: unknown }).data;
    if (data && typeof data === 'object' && 'code' in data) {
      return (data as { code: string }).code === 'UNAUTHORIZED';
    }
  }

  // Check for direct code property (CRPCClientError, etc.)
  if ('code' in error) {
    return (error as { code: string }).code === 'UNAUTHORIZED';
  }

  return false;
};
