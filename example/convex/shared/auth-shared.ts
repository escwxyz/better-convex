import { createAccessControl } from 'better-auth/plugins/access';
import {
  defaultStatements,
  memberAc,
  ownerAc,
} from 'better-auth/plugins/organization/access';
import type { Doc, Id } from '../functions/_generated/dataModel';
// biome-ignore lint/style/noRestrictedImports: types
import type { createAuth } from '../functions/auth';

export type Auth = ReturnType<typeof createAuth>;

export type SessionUser = Omit<Doc<'user'>, '_creationTime' | '_id'> & {
  id: Id<'user'>;
  activeOrganization:
    | (Omit<Doc<'organization'>, '_id'> & {
        id: Id<'organization'>;
        role: Doc<'member'>['role'];
      })
    | null;
  isAdmin: boolean;
  session: Doc<'session'>;
  impersonatedBy?: string;
  plan?: 'premium' | 'team';
};

const statement = {
  ...defaultStatements,
  projects: ['create', 'update', 'delete'],
} as const;

export const ac = createAccessControl(statement);

const member = ac.newRole({
  ...memberAc.statements,
  projects: ['create', 'update'],
});

const owner = ac.newRole({
  ...ownerAc.statements,
  projects: ['create', 'update', 'delete'],
});

export const roles = { member, owner };
