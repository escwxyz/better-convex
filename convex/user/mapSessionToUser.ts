import type { Ent } from '../shared/types';

import type { Doc, Id } from '../_generated/dataModel';

export type SessionUser = Doc<'users'> & {
  id: Id<'users'>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
};

export const mapSessionToUser = (
  user: Ent<'users'>
): Ent<'users'> & SessionUser => {
  const doc = user.doc();
  return {
    ...user,
    id: user._id,
    isAdmin: doc.role === 'ADMIN' || doc.role === 'SUPERADMIN',
    isSuperAdmin: doc.role === 'SUPERADMIN',
    doc: user.doc,
    edge: user.edge,
    edgeX: user.edgeX,
  };
};
