import { entsTableFactory } from 'convex-ents';
import { Triggers } from 'convex-helpers/server/triggers';

import type { DataModel } from './_generated/dataModel';

import {
  aggregateCharacterAwards,
  aggregateCharacterCertificates,
  aggregateCharacterEducations,
  aggregateCharacterInterestsByLevel,
  aggregateCharacterProjects,
  aggregateCharacterPublications,
  aggregateCharacterReferences,
  aggregateCharacterSkillsByLevel,
  aggregateCharacterStars,
  aggregateCharacterVolunteers,
  aggregateCharacterWorks,
  aggregateCommentsBySkill,
  aggregateCommentsByUpvotes,
  aggregateCommentUpvotes,
  aggregateMessageVotes,
  aggregateSkillsByParent,
  aggregateUserFollowsByFollower,
  aggregateUserFollowsByFollowing,
} from './aggregates';
import { entDefinitions } from './schema';

// Initialize triggers with DataModel type
export const triggers = new Triggers<DataModel>();

// ===========================================
// AGGREGATE MAINTENANCE TRIGGERS
// ===========================================
// These triggers automatically maintain aggregates when tables change
// No manual aggregate updates needed in mutations!

// Character Stars
triggers.register('characterStars', aggregateCharacterStars.trigger());

// User Follows - Custom trigger to handle both aggregates
triggers.register('follows', aggregateUserFollowsByFollowing.trigger());
triggers.register('follows', aggregateUserFollowsByFollower.trigger());

// User Characters
// TEMPORARILY DISABLED: B-tree is corrupted, causing DELETE_MISSING_KEY errors
// TODO: Re-enable after fixing the aggregate data
// triggers.register('characters', aggregateCharacters.trigger());

// Character Sub-entities
triggers.register('characterAwards', aggregateCharacterAwards.trigger());
triggers.register(
  'characterCertificates',
  aggregateCharacterCertificates.trigger()
);
triggers.register(
  'characterEducations',
  aggregateCharacterEducations.trigger()
);
triggers.register('characterProjects', aggregateCharacterProjects.trigger());
triggers.register(
  'characterPublications',
  aggregateCharacterPublications.trigger()
);
triggers.register(
  'characterReferences',
  aggregateCharacterReferences.trigger()
);
triggers.register(
  'characterVolunteers',
  aggregateCharacterVolunteers.trigger()
);
triggers.register('characterWorks', aggregateCharacterWorks.trigger());

// ===========================================
// SKILL SYSTEM AGGREGATE TRIGGERS
// ===========================================

// Skill hierarchy - count children per parent skill
triggers.register('skills', aggregateSkillsByParent.trigger());

// Comment system - count upvotes per comment
triggers.register('commentUpvotes', aggregateCommentUpvotes.trigger());

// Skill comments - count comments per skill
triggers.register('comments', aggregateCommentsBySkill.trigger());

// ===========================================
// SORTED AGGREGATE TRIGGERS
// ===========================================

// Character skills/interests sorted by level
triggers.register('characterSkills', aggregateCharacterSkillsByLevel.trigger());
triggers.register(
  'characterSkills',
  aggregateCharacterInterestsByLevel.trigger()
);

// Comments sorted by upvotes (Note: needs manual update when upvote count changes)
triggers.register('comments', aggregateCommentsByUpvotes.trigger());

// ===========================================
// CHAT SYSTEM AGGREGATE TRIGGERS
// ===========================================

// Message votes - efficient vote checking per message
triggers.register('messageVotes', aggregateMessageVotes.trigger());

// ===========================================
// SPECIAL NON-CASCADE TRIGGERS
// ===========================================

// Character Activity Tracking
triggers.register('chats', async (ctx, change) => {
  // Update character activity on insert or lastMessageAt update
  if (
    change.operation === 'insert' ||
    (change.operation === 'update' &&
      change.oldDoc?.lastMessageAt !== change.newDoc?.lastMessageAt)
  ) {
    const chat = change.operation === 'insert' ? change.newDoc : change.newDoc!;

    if (!chat.characterId) return; // Skip if no characterId

    // Upsert activity record
    const table = entsTableFactory(ctx, entDefinitions);
    const existing = await table('characterActivities').get(
      'userId_characterId',
      chat.userId,
      chat.characterId!
    );

    if (existing) {
      await table('characterActivities')
        .getX(existing._id)
        .patch({ lastMessageAt: chat.lastMessageAt });
    } else {
      await table('characterActivities').insert({
        characterId: chat.characterId,
        lastMessageAt: chat.lastMessageAt,
        userId: chat.userId,
      });
    }
  }
});

// Character Skills Category Updates
triggers.register('characterSkills', async (ctx, change) => {
  // Update categories on insert/update/delete
  if (
    change.operation === 'insert' ||
    change.operation === 'update' ||
    change.operation === 'delete'
  ) {
    const characterId =
      change.operation === 'delete'
        ? change.oldDoc!.characterId
        : change.newDoc.characterId;

    // Only update if relevant fields changed (for update operations)
    if (change.operation === 'update') {
      const oldName = change.oldDoc?.name;
      const newName = change.newDoc.name;
      const oldIsSkill = change.oldDoc?.isSkill;
      const newIsSkill = change.newDoc.isSkill;
      const oldType = change.oldDoc?.type;
      const newType = change.newDoc.type;

      // Skip if nothing relevant changed
      if (
        oldName === newName &&
        oldIsSkill === newIsSkill &&
        oldType === newType
      ) {
        return;
      }
    }

    // Get all valid categories from categorySkills table
    const table = entsTableFactory(ctx, entDefinitions);
    const validCategories = await table('categorySkills');
    const validCategoryNames = new Set(
      validCategories.map((cat) => cat.name.toLowerCase())
    );

    // Get all character skills to recalculate categories
    const characterSkills = await table('characterSkills', 'characterId', (q) =>
      q.eq('characterId', characterId)
    );

    // Build categories based on skill names that match valid categories
    const categories = new Set<string>();

    for (const skill of characterSkills) {
      // Only process skills (not interests) and exclude language type
      if (skill.isSkill && skill.type !== 'language') {
        const skillNameLower = skill.name.toLowerCase();

        // Check if skill name matches any valid category
        if (validCategoryNames.has(skillNameLower)) {
          categories.add(skillNameLower);
        }
      }
    }

    // Update character with new categories array
    await table('characters')
      .getX(characterId)
      .patch({
        categories: Array.from(categories).sort(),
      });
  }
});

// Clear mainCharacterId when character is deleted
triggers.register('characters', async (ctx, change) => {
  if (change.operation === 'delete') {
    const characterId = change.id;

    // Clear mainCharacterId from user if this was their main character
    const table = entsTableFactory(ctx, entDefinitions);
    const usersWithThisMain = await table('users', 'mainCharacterId', (q) =>
      q.eq('mainCharacterId', characterId)
    );

    for (const user of usersWithThisMain) {
      await user.patch({ mainCharacterId: undefined });
    }
  }
});
