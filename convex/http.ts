/* eslint-disable perfectionist/sort-imports */
import './helpers/polyfills';
import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import { betterAuthComponent, createAuth } from './auth';

const http = httpRouter();

betterAuthComponent.registerRoutes(http, createAuth, { cors: true });

// Stripe webhook endpoint
http.route({
  handler: httpAction(async (ctx, request) => {
    // Getting the stripe-signature header
    const signature: string = request.headers.get('stripe-signature') as string;

    // Check rate limit - using public tier for webhook
    const rateLimitOk = await ctx.runAction(
      internal.stripe.checkWebhookRateLimit,
      {
        ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
      }
    );

    if (!rateLimitOk) {
      return new Response(null, { status: 429 });
    }

    // Call the action that will process the webhook
    const result = await ctx.runAction(internal.stripe.processWebhook, {
      payload: await request.text(),
      signature,
    });

    if (result.success) {
      // Confirm successful processing so Stripe stops retrying
      return new Response(null, { status: 200 });
    } else {
      // If something goes wrong Stripe will continue retrying
      return new Response('Webhook Error', { status: 400 });
    }
  }),
  method: 'POST',
  path: '/stripe',
});

export default http;
