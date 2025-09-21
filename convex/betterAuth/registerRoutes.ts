import { type HttpRouter, httpActionGeneric } from 'convex/server';
import { corsRouter } from 'convex-helpers/server/cors';
import { requireEnv } from '@convex-dev/better-auth/utils';
import { betterAuth } from 'better-auth';

export type CreateAuth =
  | ((ctx: any) => ReturnType<typeof betterAuth>)
  | ((
      ctx: any,
      opts?: { optionsOnly?: boolean }
    ) => ReturnType<typeof betterAuth>);

export const getStaticAuth = (createAuth: CreateAuth) => {
  return createAuth({}, { optionsOnly: true });
};

export const registerRoutes = (
  http: HttpRouter,
  createAuth: CreateAuth,
  opts: {
    verbose?: boolean;
    cors?:
      | boolean
      | {
          // These values are appended to the default values
          allowedOrigins?: string[];
          allowedHeaders?: string[];
          exposedHeaders?: string[];
        };
  } = {}
) => {
  const staticAuth = getStaticAuth(createAuth);
  const path = staticAuth.options.basePath ?? '/api/auth';
  const authRequestHandler = httpActionGeneric(async (ctx, request) => {
    if (opts?.verbose) {
      console.log('options.baseURL', staticAuth.options.baseURL);
      console.log('request headers', request.headers);
    }
    const auth = createAuth(ctx as any);
    const response = await auth.handler(request);
    if (opts?.verbose) {
      console.log('response headers', response.headers);
    }
    return response;
  });
  const wellKnown = http.lookup('/.well-known/openid-configuration', 'GET');

  // If registerRoutes is used multiple times, this may already be defined
  if (!wellKnown) {
    // Redirect root well-known to api well-known
    http.route({
      path: '/.well-known/openid-configuration',
      method: 'GET',
      handler: httpActionGeneric(async () => {
        const url = `${requireEnv('CONVEX_SITE_URL')}${path}/convex/.well-known/openid-configuration`;
        return Response.redirect(url);
      }),
    });
  }

  if (!opts.cors) {
    http.route({
      pathPrefix: `${path}/`,
      method: 'GET',
      handler: authRequestHandler,
    });

    http.route({
      pathPrefix: `${path}/`,
      method: 'POST',
      handler: authRequestHandler,
    });

    return;
  }
  const corsOpts =
    typeof opts.cors === 'boolean'
      ? { allowedOrigins: [], allowedHeaders: [], exposedHeaders: [] }
      : opts.cors;
  let trustedOriginsOption:
    | string[]
    | ((request: Request) => string[] | Promise<string[]>)
    | undefined;
  const cors = corsRouter(http, {
    allowedOrigins: async (request) => {
      trustedOriginsOption =
        trustedOriginsOption ??
        (await staticAuth.$context).options.trustedOrigins ??
        [];
      const trustedOrigins = Array.isArray(trustedOriginsOption)
        ? trustedOriginsOption
        : await trustedOriginsOption(request);
      return trustedOrigins
        .map((origin) =>
          // Strip trailing wildcards, unsupported for allowedOrigins
          origin.endsWith('*') && origin.length > 1
            ? origin.slice(0, -1)
            : origin
        )
        .concat(corsOpts.allowedOrigins ?? []);
    },
    allowCredentials: true,
    allowedHeaders: ['Content-Type', 'Better-Auth-Cookie'].concat(
      corsOpts.allowedHeaders ?? []
    ),
    exposedHeaders: ['Set-Better-Auth-Cookie'].concat(
      corsOpts.exposedHeaders ?? []
    ),
    debug: opts?.verbose,
    enforceAllowOrigins: false,
  });

  cors.route({
    pathPrefix: `${path}/`,
    method: 'GET',
    handler: authRequestHandler,
  });

  cors.route({
    pathPrefix: `${path}/`,
    method: 'POST',
    handler: authRequestHandler,
  });
};
