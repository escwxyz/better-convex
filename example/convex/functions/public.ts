import { z } from 'zod';
import { publicQuery } from '../lib/crpc';

export const hello = publicQuery
  .output(z.object({ message: z.string() }))
  .query(async ({ ctx }) => {
    console.log(Math.random());

    return { message: 'Hello from Convex!' };
  });
