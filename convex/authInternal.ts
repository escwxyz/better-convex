import { getSessionUser } from '@convex/auth';
import { createInternalQuery } from '@convex/functions';

export const sessionUser = createInternalQuery()({
  args: {},
  handler: async (ctx) => {
    const user = await getSessionUser(ctx);

    if (!user) {
      return null;
    }

    return user.doc();
  },
});
