import type { Doc } from '../_generated/dataModel';

export const getUserName = (
  user: Partial<Pick<Doc<'users'>, 'firstName' | 'lastName' | 'name'>>
) => {
  if (user.name) {
    return user.name;
  }

  let name = user.firstName ?? '';

  if (user.lastName) {
    name += ' ' + user.lastName;
  }

  return name;
};
