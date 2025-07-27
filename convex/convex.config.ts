import aggregate from '@convex-dev/aggregate/convex.config';
import betterAuth from '@convex-dev/better-auth/convex.config';
import rateLimiter from '@convex-dev/rate-limiter/convex.config';
import { defineApp } from 'convex/server';

const app = defineApp();
app.use(betterAuth);
app.use(rateLimiter);
app.use(aggregate, { name: 'aggregateCharacterStars' });
app.use(aggregate, { name: 'aggregateUserFollowsByFollowing' });
app.use(aggregate, { name: 'aggregateUserFollowsByFollower' });
app.use(aggregate, { name: 'aggregateCharacters' });
app.use(aggregate, { name: 'aggregateCharacterAwards' });
app.use(aggregate, { name: 'aggregateCharacterCertificates' });
app.use(aggregate, { name: 'aggregateCharacterEducations' });
app.use(aggregate, { name: 'aggregateCharacterProjects' });
app.use(aggregate, { name: 'aggregateCharacterPublications' });
app.use(aggregate, { name: 'aggregateCharacterReferences' });
app.use(aggregate, { name: 'aggregateCharacterVolunteers' });
app.use(aggregate, { name: 'aggregateCharacterWorks' });

// Skill system aggregates
app.use(aggregate, { name: 'aggregateSkillsByParent' });
app.use(aggregate, { name: 'aggregateUpvotes' });
app.use(aggregate, { name: 'aggregateCommentsBySkill' });

// Sorted aggregates for top-N queries
app.use(aggregate, { name: 'aggregateCharacterSkillsByLevel' });
app.use(aggregate, { name: 'aggregateCharacterInterestsByLevel' });
app.use(aggregate, { name: 'aggregateCommentsByUpvotes' });

// Chat system aggregates
app.use(aggregate, { name: 'aggregateMessageVotes' });

export default app;
