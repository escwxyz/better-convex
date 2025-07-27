import { TableAggregate } from '@convex-dev/aggregate';

import type { DataModel } from './_generated/dataModel';

import { components } from './_generated/api';

// Aggregate for character stars
export const aggregateCharacterStars = new TableAggregate<{
  DataModel: DataModel;
  Key: null; // No sorting, just counting
  Namespace: string; // characterId
  TableName: 'characterStars';
}>(components.aggregateCharacterStars, {
  namespace: (doc) => doc.characterId,
  sortKey: () => null, // We only care about counting, not sorting
});

// Aggregate for user follows by following (users following this user)
export const aggregateUserFollowsByFollowing = new TableAggregate<{
  DataModel: DataModel;
  Key: null; // No sorting, just counting
  Namespace: string; // userId being followed (followingId)
  TableName: 'follows';
}>(components.aggregateUserFollowsByFollowing, {
  namespace: (doc) => doc.followingId,
  sortKey: () => null, // We only care about counting, not sorting
});

// Aggregate for user follows by follower (users this user follows)
export const aggregateUserFollowsByFollower = new TableAggregate<{
  DataModel: DataModel;
  Key: null; // No sorting, just counting
  Namespace: string; // userId doing the following (followerId)
  TableName: 'follows';
}>(components.aggregateUserFollowsByFollower, {
  namespace: (doc) => doc.followerId,
  sortKey: () => null, // We only care about counting, not sorting
});

// Aggregate for characters per user
export const aggregateCharacters = new TableAggregate<{
  DataModel: DataModel;
  Key: null; // No sorting, just counting
  Namespace: string; // userId
  TableName: 'characters';
}>(components.aggregateCharacters, {
  namespace: (doc) => doc.userId,
  sortKey: () => null, // We only care about counting, not sorting
});

// Character sub-entity aggregates

// Aggregate for character awards
export const aggregateCharacterAwards = new TableAggregate<{
  DataModel: DataModel;
  Key: null; // No sorting, just counting
  Namespace: string; // characterId
  TableName: 'characterAwards';
}>(components.aggregateCharacterAwards, {
  namespace: (doc) => doc.characterId,
  sortKey: () => null, // We only care about counting, not sorting
});

// Aggregate for character certificates
export const aggregateCharacterCertificates = new TableAggregate<{
  DataModel: DataModel;
  Key: null; // No sorting, just counting
  Namespace: string; // characterId
  TableName: 'characterCertificates';
}>(components.aggregateCharacterCertificates, {
  namespace: (doc) => doc.characterId,
  sortKey: () => null, // We only care about counting, not sorting
});

// Aggregate for character educations
export const aggregateCharacterEducations = new TableAggregate<{
  DataModel: DataModel;
  Key: null; // No sorting, just counting
  Namespace: string; // characterId
  TableName: 'characterEducations';
}>(components.aggregateCharacterEducations, {
  namespace: (doc) => doc.characterId,
  sortKey: () => null, // We only care about counting, not sorting
});

// Aggregate for character projects
export const aggregateCharacterProjects = new TableAggregate<{
  DataModel: DataModel;
  Key: null; // No sorting, just counting
  Namespace: string; // characterId
  TableName: 'characterProjects';
}>(components.aggregateCharacterProjects, {
  namespace: (doc) => doc.characterId,
  sortKey: () => null, // We only care about counting, not sorting
});

// Aggregate for character publications
export const aggregateCharacterPublications = new TableAggregate<{
  DataModel: DataModel;
  Key: null; // No sorting, just counting
  Namespace: string; // characterId
  TableName: 'characterPublications';
}>(components.aggregateCharacterPublications, {
  namespace: (doc) => doc.characterId,
  sortKey: () => null, // We only care about counting, not sorting
});

// Aggregate for character references
export const aggregateCharacterReferences = new TableAggregate<{
  DataModel: DataModel;
  Key: null; // No sorting, just counting
  Namespace: string; // characterId
  TableName: 'characterReferences';
}>(components.aggregateCharacterReferences, {
  namespace: (doc) => doc.characterId,
  sortKey: () => null, // We only care about counting, not sorting
});

// Aggregate for character volunteers
export const aggregateCharacterVolunteers = new TableAggregate<{
  DataModel: DataModel;
  Key: null; // No sorting, just counting
  Namespace: string; // characterId
  TableName: 'characterVolunteers';
}>(components.aggregateCharacterVolunteers, {
  namespace: (doc) => doc.characterId,
  sortKey: () => null, // We only care about counting, not sorting
});

// Aggregate for character works
export const aggregateCharacterWorks = new TableAggregate<{
  DataModel: DataModel;
  Key: null; // No sorting, just counting
  Namespace: string; // characterId
  TableName: 'characterWorks';
}>(components.aggregateCharacterWorks, {
  namespace: (doc) => doc.characterId,
  sortKey: () => null, // We only care about counting, not sorting
});

// ===========================================
// SKILL SYSTEM AGGREGATES
// ===========================================

// Aggregate for skills by parent (child skills per parent skill)
export const aggregateSkillsByParent = new TableAggregate<{
  DataModel: DataModel;
  Key: null; // No sorting, just counting
  Namespace: string; // parentSkillId
  TableName: 'skills';
}>(components.aggregateSkillsByParent, {
  namespace: (doc) => doc.parentSkillId!,
  sortKey: () => null, // We only care about counting, not sorting
});

// Aggregate for upvotes per comment
export const aggregateCommentUpvotes = new TableAggregate<{
  DataModel: DataModel;
  Key: null; // No sorting, just counting
  Namespace: string; // commentId
  TableName: 'commentUpvotes';
}>(components.aggregateUpvotes, {
  namespace: (doc) => doc.commentId,
  sortKey: () => null, // We only care about counting, not sorting
});

// Aggregate for comments per skill
export const aggregateCommentsBySkill = new TableAggregate<{
  DataModel: DataModel;
  Key: null; // No sorting, just counting
  Namespace: string; // skillId
  TableName: 'comments';
}>(components.aggregateCommentsBySkill, {
  namespace: (doc) => doc.skillId!,
  sortKey: () => null, // We only care about counting, not sorting
});

// ===========================================
// SORTED AGGREGATES FOR TOP-N QUERIES
// ===========================================

// Aggregate for character skills sorted by level (for top skills display)
export const aggregateCharacterSkillsByLevel = new TableAggregate<{
  DataModel: DataModel;
  Key: [number, string]; // [level desc, name asc]
  Namespace: string; // characterId
  TableName: 'characterSkills';
}>(components.aggregateCharacterSkillsByLevel, {
  namespace: (doc) => doc.characterId,
  sortKey: (doc) => [
    -(doc.level ? Number.parseInt(doc.level) : 0), // Negative for descending order
    doc.name, // Secondary sort by name
  ],
});

// Aggregate for character interests sorted by level
export const aggregateCharacterInterestsByLevel = new TableAggregate<{
  DataModel: DataModel;
  Key: [number, string]; // [level desc, name asc]
  Namespace: string; // characterId
  TableName: 'characterSkills';
}>(components.aggregateCharacterInterestsByLevel, {
  namespace: (doc) => doc.characterId,
  sortKey: (doc) => [
    -(doc.interestLevel ? Number.parseInt(doc.interestLevel) : 0), // Negative for descending order
    doc.name, // Secondary sort by name
  ],
});

// Aggregate for comments sorted by upvote count (for popular comments)
export const aggregateCommentsByUpvotes = new TableAggregate<{
  DataModel: DataModel;
  Key: [number, number]; // [upvote count desc, creation time desc]
  Namespace: string; // skillId
  TableName: 'comments';
}>(components.aggregateCommentsByUpvotes, {
  namespace: (doc) => doc.skillId!,
  sortKey: (doc) => [
    0, // Placeholder - will need to be updated with actual upvote count
    -doc._creationTime, // Negative for descending order
  ],
});

// ===========================================
// CHAT SYSTEM AGGREGATES
// ===========================================

// Aggregate for all message votes
export const aggregateMessageVotes = new TableAggregate<{
  DataModel: DataModel;
  Key: null;
  Namespace: string; // messageId
  TableName: 'messageVotes';
}>(components.aggregateMessageVotes, {
  namespace: (doc) => doc.messageId,
  sortKey: () => null,
});
