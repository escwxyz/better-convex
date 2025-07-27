export const bucketRoutes = {
  character: (characterId: string) => `users/characters/${characterId}`,
  characterFile: (characterId: string, fileId: string) => {
    return `users/characters/${characterId}-files/${fileId}`;
  },
  draftCharacter: (userId: string) => `users/characters/draft-${userId}`,
  profileImage: (userId: string) => `users/${userId}`,
};
