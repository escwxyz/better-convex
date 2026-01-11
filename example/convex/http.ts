import './helpers/polyfills';
import { registerRoutes } from 'better-auth-convex';
import { httpRouter } from 'convex/server';
import { createAuth } from './auth';

const http = httpRouter();

registerRoutes(http, createAuth);

export default http;
