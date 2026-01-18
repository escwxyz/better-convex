import type { GenericActionCtx, GenericDataModel } from 'convex/server';
import type { z } from 'zod';
import type { AnyMiddleware, UnsetMarker } from './types';

// Procedure metadata (same as TMeta generic)
export type ProcedureMeta = object;

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Route definition stored on the procedure
export interface HttpRouteDefinition<TMethod extends HttpMethod = HttpMethod> {
  path: string;
  method: TMethod;
  pathParamNames: string[];
  usePathPrefix: boolean;
}

// Context available in HTTP action handlers
export interface HttpRequestContext {
  request: Request;
  headers: Headers;
  url: URL;
  pathParams: Record<string, string>;
}

/**
 * Infer output type from schema, defaulting to void for UnsetMarker
 */
export type InferHttpInput<T> = T extends UnsetMarker
  ? undefined
  : T extends z.ZodTypeAny
    ? z.output<T>
    : never;

/**
 * Internal definition for HttpProcedureBuilder
 * Stores schema types directly (like QueryProcedureBuilder)
 */
export interface HttpProcedureBuilderDef<
  TCtx,
  TInput extends UnsetMarker | z.ZodTypeAny,
  TOutput extends UnsetMarker | z.ZodTypeAny,
  TParams extends UnsetMarker | z.ZodTypeAny,
  TQuery extends UnsetMarker | z.ZodTypeAny,
  TMeta extends ProcedureMeta,
  TMethod extends HttpMethod = HttpMethod,
> {
  middlewares: AnyMiddleware[];
  meta: TMeta;
  inputSchema?: z.ZodTypeAny;
  outputSchema?: z.ZodTypeAny;
  paramsSchema?: z.ZodTypeAny;
  querySchema?: z.ZodTypeAny;
  route?: HttpRouteDefinition<TMethod>;
  rawMode?: boolean;
  responseMode?: boolean;
  /** Per-procedure CORS config. false to disable, undefined to inherit from router. */
  cors?: CORSOptions | false;
  functionConfig: {
    base: HttpActionConstructor;
    createContext: (ctx: GenericActionCtx<GenericDataModel>) => TCtx;
  };
  /** @internal Phantom types for type inference */
  _types?: {
    input: TInput;
    output: TOutput;
    params: TParams;
    query: TQuery;
  };
}

// Type for httpAction constructor from convex/server (HttpActionBuilder)
export type HttpActionConstructor = (
  handler: (
    ctx: GenericActionCtx<GenericDataModel>,
    request: Request
  ) => Promise<Response>
) => HttpActionHandler;

// Return type of httpAction() - matches Convex's PublicHttpAction
export interface HttpActionHandler {
  isHttp: true;
}

// Final HTTP procedure with route metadata and def for client type inference
export interface HttpProcedure<
  TInput extends UnsetMarker | z.ZodTypeAny = any,
  TOutput extends UnsetMarker | z.ZodTypeAny = any,
  TParams extends UnsetMarker | z.ZodTypeAny = any,
  TQuery extends UnsetMarker | z.ZodTypeAny = any,
  TMethod extends HttpMethod = HttpMethod,
> extends HttpActionHandler {
  _crpcHttpRoute: HttpRouteDefinition<TMethod>;
  /** @internal Expose def for client-side type inference */
  _def: {
    inputSchema?: TInput;
    outputSchema?: TOutput;
    paramsSchema?: TParams;
    querySchema?: TQuery;
  };
  /** @internal Resolved CORS config (set by router registration) */
  _cors?: CORSOptions | false;
}

/**
 * Handler options type - conditionally includes input, params, query based on what's defined
 */
export type HttpHandlerOpts<
  TCtx,
  TInput extends UnsetMarker | z.ZodTypeAny,
  TParams extends UnsetMarker | z.ZodTypeAny,
  TQuery extends UnsetMarker | z.ZodTypeAny,
  TRawMode extends boolean,
> = TRawMode extends true
  ? { ctx: TCtx & HttpRequestContext; request: Request }
  : { ctx: TCtx & HttpRequestContext } & (TInput extends UnsetMarker
      ? { input?: undefined }
      : { input: z.output<TInput> }) &
      (TParams extends UnsetMarker ? object : { params: z.output<TParams> }) &
      (TQuery extends UnsetMarker ? object : { query: z.output<TQuery> });

// CORS configuration
export interface CORSOptions {
  allowedOrigins?: string[] | '*';
  allowedMethods?: HttpMethod[];
  allowedHeaders?: string[];
  allowCredentials?: boolean;
  maxAge?: number;
}

// Router options for createCRPCRouter
export interface CRPCRouterOptions {
  cors?: CORSOptions;
  /** The httpAction constructor from convex/server - required for CORS preflight handlers */
  httpAction?: HttpActionConstructor;
}
