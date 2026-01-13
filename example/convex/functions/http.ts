import '../lib/http-polyfills';
import { registerRoutes } from 'better-convex/auth';
import { httpRouter } from 'convex/server';
import { createAuth } from './auth';

const http = httpRouter();

registerRoutes(http, createAuth);

export default http;
