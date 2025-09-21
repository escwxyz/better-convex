import './helpers/polyfills';
import { httpRouter } from 'convex/server';
import { createAuth } from './auth';
import { registerRoutes } from './betterAuth/registerRoutes';

const http = httpRouter();

registerRoutes(http, createAuth as any);

export default http;
