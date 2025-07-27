import { ConvexError } from 'convex/values';

// Helper function to check role authorization
export function roleGuard(
  role: 'ADMIN' | 'SUPERADMIN',
  user: { isAdmin?: boolean; isSuperAdmin?: boolean; role?: string } | null
) {
  if (!user) {
    throw new ConvexError({
      code: 'FORBIDDEN',
      message: 'Access denied',
    });
  }
  if (role === 'ADMIN' && !user.isAdmin) {
    throw new ConvexError({
      code: 'FORBIDDEN',
      message: 'Admin access required',
    });
  }
  if (role === 'SUPERADMIN' && !user.isSuperAdmin) {
    throw new ConvexError({
      code: 'FORBIDDEN',
      message: 'Super admin access required',
    });
  }
}
