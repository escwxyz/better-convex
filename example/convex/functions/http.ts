import './helpers/polyfills';
import { httpRouter } from 'convex/server';
import { registerRoutes } from 'better-convex/auth';
import { createAuth } from './auth';

const http = httpRouter();

registerRoutes(http, createAuth);

export default http;
