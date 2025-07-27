/* eslint-disable unicorn/no-array-push-push */
import { zid } from 'convex-helpers/server/zod';
import { z } from 'zod';

import type { Id } from './_generated/dataModel';
import type { EntInsertMany } from './shared/types';

import { internal } from './_generated/api';
import { createInternalAction, createInternalMutation } from './functions';
import { getEnv } from './helpers/getEnv';

// Helper to generate IDs similar to nid()
export const generateId = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';

  for (let i = 0; i < 12; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
};

// Helper to generate sample messages for different chat types
export const getSampleMessages = (
  chatTitle: string,
  userId: Id<'users'>,
  baseTime: number
) => {
  const messages: {
    parts: any;
    role: string;
    userId?: Id<'users'>;
  }[] = [];

  switch (chatTitle) {
    case 'Daily Notes': {
      messages.push(
        {
          parts: [
            {
              text: "Daily reflection for today:\n\n✅ **Accomplished:**\n- Finished the new feature implementation\n- Had a productive 1:1 with my manager\n- Learned about GraphQL subscriptions\n\n🤔 **Challenges:**\n- Debugging a tricky race condition\n- Time management - meetings ran over\n\n🎯 **Tomorrow's focus:**\n- Fix the race condition bug\n- Start working on the mobile responsive design\n- Review teammate's pull request",
              type: 'text',
            },
          ],
          role: 'user',
          userId,
        },
        {
          parts: [
            {
              text: 'Great reflection! I love how you\'re tracking both wins and challenges. A few thoughts:\n\n**On the race condition:** These can be tricky! Common patterns that help:\n- Add proper locks/semaphores\n- Use atomic operations where possible\n- Consider event sourcing for complex state changes\n- Debug with detailed logging/timestamps\n\n**For time management:** Meeting overruns are so common! Try:\n- Setting calendar reminders 5min before end\n- Suggesting "parking lot" for tangent topics\n- Ending early when objectives are met\n\n**For tomorrow:** Looks like a solid plan! Consider tackling the bug first when your mind is fresh.\n\nWhat\'s your biggest learning from the GraphQL subscriptions exploration?',
              type: 'text',
            },
          ],
          role: 'assistant',
        },
        {
          parts: [
            {
              text: "The GraphQL subscriptions were eye-opening! I didn't realize how much simpler real-time updates could be compared to polling. The WebSocket handling is so much cleaner than what we had before.",
              type: 'text',
            },
          ],
          role: 'user',
          userId,
        }
      );

      break;
    }
    case 'Daily Standup Notes': {
      messages.push(
        {
          parts: [
            {
              text: 'Daily standup summary:\n\n**Yesterday:**\n- Completed user authentication flow\n- Fixed 3 critical bugs\n\n**Today:**\n- Working on payment integration\n- Code review for team members\n\n**Blockers:**\n- Waiting for API keys from payment provider',
              type: 'text',
            },
          ],
          role: 'user',
          userId,
        },
        {
          parts: [
            {
              text: 'Great progress on the authentication flow! 🎉\n\n**Suggestions for today:**\n1. While waiting for payment API keys, you could:\n   - Set up mock payment endpoints\n   - Create unit tests for payment logic\n   - Design the payment UI components\n\n2. For the code review, consider:\n   - Focus on security practices\n   - Performance optimizations\n   - Code consistency\n\n**Action items:**\n- Follow up on API keys timeline\n- Document any assumptions made during mock implementation\n\nNeed help with anything specific?',
              type: 'text',
            },
          ],
          role: 'assistant',
        },
        {
          parts: [
            {
              text: 'Thanks! Actually, yes - could you help me create a checklist template for our code reviews?',
              type: 'text',
            },
          ],
          role: 'user',
          userId,
        },
        {
          parts: [
            {
              text: "Absolutely! Here's a comprehensive code review checklist:\n\n## **Code Review Checklist** ✅\n\n### **Functionality**\n- [ ] Code works as intended\n- [ ] Edge cases are handled\n- [ ] Error handling is implemented\n\n### **Code Quality**\n- [ ] Code is readable and well-commented\n- [ ] Functions are single-purpose\n- [ ] Variable names are descriptive\n- [ ] No code duplication\n\n### **Security**\n- [ ] Input validation present\n- [ ] No sensitive data in logs\n- [ ] Authentication/authorization checks\n\n### **Performance**\n- [ ] No obvious performance issues\n- [ ] Database queries are optimized\n- [ ] Caching implemented where needed\n\n### **Testing**\n- [ ] Unit tests included\n- [ ] Tests cover main scenarios\n- [ ] Tests are passing\n\nFeel free to customize this for your team's needs!",
              type: 'text',
            },
          ],
          role: 'assistant',
        }
      );

      break;
    }
    case 'Learning Journal': {
      messages.push(
        {
          parts: [
            {
              text: 'Starting to learn about machine learning fundamentals. Today I went through linear regression and gradient descent. The math is starting to click!',
              type: 'text',
            },
          ],
          role: 'user',
          userId,
        },
        {
          parts: [
            {
              text: 'That\'s awesome! Linear regression and gradient descent are such fundamental concepts - once they click, so much else becomes clearer. \n\n**Key insights you might be having:**\n- How we can find optimal parameters by following the "slope"\n- Why we need to balance learning rate (too fast = overshoot, too slow = forever)\n- How loss functions guide our optimization\n\n**Great next steps:**\n- Try implementing gradient descent from scratch\n- Experiment with different learning rates\n- Move to logistic regression (similar math, different application)\n- Explore regularization (preventing overfitting)\n\n**Hands-on practice:** Try the classic housing price prediction dataset - it\'s perfect for solidifying linear regression concepts!\n\nWhat part of the math surprised you the most?',
              type: 'text',
            },
          ],
          role: 'assistant',
        },
        {
          parts: [
            {
              text: "I think what surprised me most was how gradient descent is just calculus optimization applied iteratively. The derivative telling us which direction to move - it's so elegant once you see it!",
              type: 'text',
            },
          ],
          role: 'user',
          userId,
        },
        {
          parts: [
            {
              text: "Exactly! That's such a beautiful realization. You've grasped something really fundamental about how machine learning works at its core.\n\n**Building on that insight:**\n- Neural networks are just chaining these derivatives (backpropagation)\n- Different optimizers (Adam, RMSprop) are fancy versions of gradient descent\n- The 'loss landscape' is like a mountainous terrain we're navigating\n\n**Fun connection:** This same principle applies everywhere:\n- Physics (finding energy minima)\n- Economics (optimizing utility functions)\n- Engineering (minimizing cost functions)\n\nYou're thinking like a mathematician now! Ready to tackle some neural networks? 🧠",
              type: 'text',
            },
          ],
          role: 'assistant',
        }
      );

      break;
    }
    case 'Personal Brainstorming': {
      messages.push(
        {
          parts: [
            {
              text: "I've been thinking about my career direction and want to explore some new ideas. Can you help me brainstorm?",
              type: 'text',
            },
          ],
          role: 'user',
          userId,
        },
        {
          parts: [
            {
              text: "I'd love to help you brainstorm! Career exploration is exciting. What areas are you most curious about right now? Are you looking to:\n\n- Build on your current skills?\n- Explore completely new fields?\n- Find ways to combine your interests?\n- Solve specific challenges you've noticed?\n\nTell me what's been on your mind lately!",
              type: 'text',
            },
          ],
          role: 'assistant',
        },
        {
          parts: [
            {
              text: "I'm really interested in the intersection of technology and sustainability. I have a background in software development, but I want to make a more meaningful impact on environmental issues.",
              type: 'text',
            },
          ],
          role: 'user',
          userId,
        },
        {
          parts: [
            {
              text: "That's a fantastic combination! Tech for sustainability is a rapidly growing field with huge potential. Here are some directions you could explore:\n\n**Direct Environmental Tech:**\n- Carbon tracking and reduction software\n- Smart energy management systems\n- Environmental monitoring platforms\n- Supply chain transparency tools\n\n**Adjacent Opportunities:**\n- Green fintech (sustainable investing platforms)\n- Circular economy marketplaces\n- Climate data analytics\n- Remote work tools (reducing commute emissions)\n\n**Getting Started:**\n- Join hackathons focused on climate tech\n- Contribute to open source environmental projects\n- Network with organizations like Climate Tech Jobs\n- Consider roles at B-Corps or impact-focused companies\n\nWhat resonates most with you?",
              type: 'text',
            },
          ],
          role: 'assistant',
        }
      );

      break;
    }
    case 'Project Planning': {
      messages.push(
        {
          parts: [
            {
              text: "Hey team! Let's discuss the project roadmap and key milestones for this quarter.",
              type: 'text',
            },
          ],
          role: 'user',
          userId,
        },
        {
          parts: [
            {
              text: "Great idea! I can help you structure the project roadmap. What are the main deliverables you're aiming for this quarter?",
              type: 'text',
            },
          ],
          role: 'assistant',
        },
        {
          parts: [
            {
              text: 'We need to complete the MVP, set up CI/CD pipeline, and conduct user testing. Timeline is about 8 weeks.',
              type: 'text',
            },
          ],
          role: 'user',
          userId,
        },
        {
          parts: [
            {
              text: "Perfect! Here's a suggested breakdown:\n\n**Weeks 1-3**: MVP Development\n- Core features implementation\n- Basic UI/UX\n\n**Weeks 4-5**: CI/CD Setup\n- Automated testing\n- Deployment pipeline\n\n**Weeks 6-8**: User Testing\n- Beta release\n- Feedback collection\n- Iterations\n\nWould you like me to help create detailed tasks for each phase?",
              type: 'text',
            },
          ],
          role: 'assistant',
        }
      );

      break;
    }
    case 'Quick Questions': {
      messages.push(
        {
          parts: [
            {
              text: "Quick question - what's the best way to handle async errors in JavaScript?",
              type: 'text',
            },
          ],
          role: 'user',
          userId,
        },
        {
          parts: [
            {
              text: "Great question! Here are the main approaches for handling async errors in JavaScript:\n\n**1. Try-Catch with Async/Await:**\n```javascript\ntry {\n  const result = await someAsyncFunction();\n  // handle success\n} catch (error) {\n  // handle error\n  console.error('Error:', error.message);\n}\n```\n\n**2. Promise .catch():**\n```javascript\nsomeAsyncFunction()\n  .then(result => {\n    // handle success\n  })\n  .catch(error => {\n    // handle error\n  });\n```\n\n**3. Global Error Handlers:**\n```javascript\n// Unhandled promise rejections\nprocess.on('unhandledRejection', (reason, promise) => {\n  console.info('Unhandled Rejection at:', promise, 'reason:', reason);\n});\n```\n\n**Best Practice:** Use try-catch with async/await for cleaner, more readable code!",
              type: 'text',
            },
          ],
          role: 'assistant',
        },
        {
          parts: [
            {
              text: 'Perfect, thanks! Another quick one - any recommendations for state management in React?',
              type: 'text',
            },
          ],
          role: 'user',
          userId,
        },
        {
          parts: [
            {
              text: "Sure! Here's a quick rundown based on your needs:\n\n**For Simple Apps:**\n- `useState` + `useContext` (built-in React)\n- Jotai (atomic state management)\n\n**For Medium Complexity:**\n- Zustand (lightweight, easy to use)\n- React Query/TanStack Query (for server state)\n\n**For Complex Apps:**\n- Redux Toolkit (most mature ecosystem)\n- Valtio (proxy-based state)\n\n**My Recommendation:** Start with Zustand for client state + React Query for server state. This combo handles 90% of use cases with minimal boilerplate!\n\nWhat type of app are you building?",
              type: 'text',
            },
          ],
          role: 'assistant',
        }
      );

      break;
    }
    case 'Technical Discussion': {
      messages.push(
        {
          parts: [
            {
              text: "I'm having issues with the database performance. Queries are taking too long, especially for complex joins.",
              type: 'text',
            },
          ],
          role: 'user',
          userId,
        },
        {
          parts: [
            {
              text: "Database performance issues can be frustrating! Let's troubleshoot this. Can you share:\n\n1. What database are you using?\n2. Approximate data size\n3. Example of a slow query\n4. Current indexing strategy?",
              type: 'text',
            },
          ],
          role: 'assistant',
        },
        {
          parts: [
            {
              text: "We're using PostgreSQL with about 2M records. Here's one slow query:\n\n```sql\nSELECT u.*, p.title, c.content \nFROM users u \nJOIN projects p ON u.id = p.user_id \nJOIN comments c ON p.id = c.project_id \nWHERE u.created_at > '2024-01-01'\n```",
              type: 'text',
            },
          ],
          role: 'user',
          userId,
        },
        {
          parts: [
            {
              text: "I see the issue! This query could benefit from several optimizations:\n\n**1. Add Indexes:**\n```sql\nCREATE INDEX idx_users_created_at ON users(created_at);\nCREATE INDEX idx_projects_user_id ON projects(user_id);\nCREATE INDEX idx_comments_project_id ON comments(project_id);\n```\n\n**2. Consider Query Rewrite:**\nIf you don't need all comments, add limits or filters\n\n**3. Analyze Execution Plan:**\n```sql\nEXPLAIN ANALYZE [your query]\n```\n\nThis should significantly improve performance. Want me to help with more specific optimizations?",
              type: 'text',
            },
          ],
          role: 'assistant',
        }
      );

      break;
    }
    // No default
  }

  return messages;
};

// Helper to create character with default hide fields
const createCharacterData = (data: {
  name: string;
  userId: Id<'users'>;
  email?: string;
  image?: string;
  label?: string;
  location?: string;
  private?: boolean;
  summary?: string;
  url?: string;
}) => ({
  ...data,
  awardsHide: false,
  certificatesHide: false,
  educationHide: false,
  interestsHide: false,
  languagesHide: false,
  private: data.private ?? false,
  projectsHide: false,
  publicationsHide: false,
  referencesHide: false,
  skillsHide: false,
  volunteerHide: false,
  workHide: false,
});

// Admin configuration - moved inside functions to avoid module-level execution
const getAdminConfig = () => {
  const adminEmail = getEnv().SUPERADMIN[0] || 'admin@gmail.com';
  let adminUsername = adminEmail.split('@')[0];

  if (adminUsername.includes('.')) {
    adminUsername =
      adminUsername.split('.')[0].charAt(0) + adminUsername.split('.')[1];
  }

  return { adminEmail, adminUsername };
};

// Seed data identifiers - this function will be called with admin config
const getSeedEmails = (adminConfig: {
  adminEmail: string;
  adminUsername: string;
}) => [
  // adminConfig.adminEmail, // Don't include admin in cleanup
  'alice@gmail.com',
  'bob@gmail.com',
  'carol@gmail.com',
  'dave@gmail.com',
];

// Seed data - this function will be called with admin config
const getUsersData = (adminConfig: {
  adminEmail: string;
  adminUsername: string;
}) => [
  {
    id: adminConfig.adminUsername,
    bio: undefined,
    credits: 1000,
    email: adminConfig.adminEmail,
    monthlyCredits: 100,
    name: 'Admin',
    profileImageUrl: 'https://avatars.githubusercontent.com/u/1',
    role: 'SUPERADMIN' as const,
    username: adminConfig.adminUsername,
  },
  {
    id: 'alice',
    bio: 'Frontend Developer',
    credits: 100,
    email: 'alice@gmail.com',
    monthlyCredits: 10,
    name: 'Alice Johnson',
    profileImageUrl: 'https://avatars.githubusercontent.com/u/2',
    role: 'USER' as const,
    username: 'alice',
  },
  {
    id: 'bob',
    bio: 'Backend Developer',
    credits: 150,
    email: 'bob@gmail.com',
    monthlyCredits: 15,
    name: 'Bob Smith',
    profileImageUrl: 'https://avatars.githubusercontent.com/u/3',
    role: 'USER' as const,
    username: 'bob',
  },
  {
    id: 'carol',
    bio: 'UI/UX Designer',
    credits: 200,
    email: 'carol@gmail.com',
    monthlyCredits: 20,
    name: 'Carol Williams',
    profileImageUrl: 'https://avatars.githubusercontent.com/u/4',
    role: 'USER' as const,
    username: 'carol',
  },
  {
    id: 'dave',
    bio: 'DevOps Engineer',
    credits: 175,
    email: 'dave@gmail.com',
    monthlyCredits: 17,
    name: 'Dave Brown',
    profileImageUrl: undefined,
    role: 'USER' as const,
    username: 'dave',
  },
];

const categorySkillsData = [
  {
    description: 'Long-term vision and strategic planning',
    name: 'Strategy',
    order: 1,
  },
  {
    description: 'Plan execution and operational excellence',
    name: 'Operations',
    order: 2,
  },
  {
    description: 'Team management and leadership',
    name: 'Leadership',
    order: 3,
  },
  {
    description: 'Analysis and strategic intelligence',
    name: 'Research',
    order: 4,
  },
  {
    description: 'Creative problem solving and innovation',
    name: 'Innovation',
    order: 5,
  },
  {
    description: 'Product strategy and development',
    name: 'Product',
    order: 6,
  },
  {
    description: 'User experience and interface design',
    name: 'Design',
    order: 7,
  },
  {
    description: 'Business growth and user acquisition',
    name: 'Growth',
    order: 8,
  },
];

const tagData = [
  { color: '#3b82f6', name: 'Programming' },
  { color: '#ef4444', name: 'Design' },
  { color: '#10b981', name: 'Marketing' },
  { color: '#f59e0b', name: 'Business' },
  { color: '#8b5cf6', name: 'Writing' },
  { color: '#6366f1', name: 'Frontend' },
  { color: '#14b8a6', name: 'Backend' },
  { color: '#f43f5e', name: 'DevOps' },
  { color: '#8b5cf6', name: 'UI/UX' },
  { color: '#22c55e', name: 'Database' },
];

// Main seed function that orchestrates everything
export const seed = createInternalAction()({
  args: {},
  returns: z.null(),
  handler: async (ctx) => {
    console.info('🌱 Starting seeding...');

    try {
      // Step 1: Clean up existing seed data
      await ctx.runMutation(internal.seed.cleanupSeedData);

      // Step 2: Seed users
      const userIds = await ctx.runMutation(internal.seed.seedUsers);

      // Step 3: Seed category skills
      await ctx.runMutation(internal.seed.seedCategorySkills);

      // Step 4: Seed tags
      await ctx.runMutation(internal.seed.seedTags, { adminId: userIds[0] });

      // Step 5: Seed characters
      const characterIds = await ctx.runMutation(internal.seed.seedCharacters, {
        userIds,
      });

      // Step 6: Seed skills
      const skillIds = await ctx.runMutation(internal.seed.seedSkills, {
        adminId: userIds[0],
        userIds,
      });

      // Step 7: Seed character skills and relationships
      await ctx.runMutation(internal.seed.seedCharacterRelationships, {
        characterIds,
        skillIds,
        userIds,
      });

      // Step 8: Seed social data (follows, stars, etc.)
      await ctx.runMutation(internal.seed.seedSocialData, {
        adminId: userIds[0],
        skillIds,
        userIds,
      });

      // Step 9: Seed projects and project members
      await ctx.runMutation(internal.seed.seedProjects, {
        adminId: userIds[0],
        userIds,
      });

      // Step 10: Seed recent chats (chats without projects)
      await ctx.runMutation(internal.seed.seedRecentChats, {
        userId: userIds[0],
      });

      console.info('✅ Seeding finished');
    } catch (error) {
      console.error('❌ Error while seeding:', error);

      throw error;
    }

    return null;
  },
});

// Clean up existing seed data
export const cleanupSeedData = createInternalMutation()({
  args: {},
  returns: z.null(),
  handler: async (ctx) => {
    console.info(
      '🧹 Starting cleanup of seed data (preserving users and sessions)...'
    );

    // Find ALL users (including admin) to clean their related data
    const { adminEmail } = getAdminConfig();
    const seedEmails = getSeedEmails({ adminEmail, adminUsername: '' }); // adminUsername not needed here
    const allUsers = await ctx.table('users').filter((q) =>
      q.or(
        ...seedEmails.map((email) => q.eq(q.field('email'), email)),
        q.eq(q.field('email'), adminEmail) // Include admin
      )
    );

    const allUserIds = allUsers.map((user) => user._id);

    if (allUserIds.length > 0) {
      // Delete all related data in correct order
      // NOTE: We preserve users and sessions to maintain auth

      // Delete notifications
      const notifications = await ctx
        .table('notifications')
        .filter((q) =>
          q.or(
            ...allUserIds.map((id) => q.eq(q.field('userId'), id)),
            ...allUserIds.map((id) => q.eq(q.field('senderId'), id))
          )
        );

      for (const notification of notifications) {
        await ctx.table('notifications').getX(notification._id).delete();
      }

      console.info(`  🗑️ Deleted ${notifications.length} notifications`);

      // Delete user follows
      let followCount = 0;

      for (const userId of allUserIds) {
        const user = await ctx.table('users').get(userId);

        if (user) {
          // Get all users this user is following
          const following = await user.edge('following');
          followCount += following.length;

          // Clear all following relationships
          if (following.length > 0) {
            await user.patch({
              following: { remove: following.map((u) => u._id) },
            });
          }
        }
      }

      console.info(`  🗑️ Deleted ${followCount} user follows`);

      // Delete chats and messages
      const chats = await ctx
        .table('chats')
        .filter((q) =>
          q.or(...allUserIds.map((id) => q.eq(q.field('userId'), id)))
        );

      let messageCount = 0;
      let chatCharCount = 0;

      for (const chat of chats) {
        // Delete messages in this chat
        const messages = await chat.edge('messages');

        for (const message of messages) {
          await ctx.table('messages').getX(message._id).delete();
          messageCount++;
        }

        // Delete chat characters
        const chatCharacters = await chat.edge('chatCharacters');

        for (const chatChar of chatCharacters) {
          await ctx.table('chatCharacters').getX(chatChar._id).delete();
          chatCharCount++;
        }

        await ctx.table('chats').getX(chat._id).delete();
      }

      console.info(
        `  🗑️ Deleted ${chats.length} chats, ${messageCount} messages, ${chatCharCount} chat characters`
      );

      // Delete characters and all related data
      const characters = await ctx
        .table('characters')
        .filter((q) =>
          q.or(...allUserIds.map((id) => q.eq(q.field('userId'), id)))
        );

      let charSkillCount = 0;
      let charWorkCount = 0;
      let charEducationCount = 0;
      let charOtherCount = 0;

      for (const character of characters) {
        // Delete character skills
        const charSkills = await character.edge('skills');

        for (const skill of charSkills) {
          await ctx.table('characterSkills').getX(skill._id).delete();
          charSkillCount++;
        }

        // Delete character work
        const works = await character.edge('works');

        for (const work of works) {
          await ctx.table('characterWorks').getX(work._id).delete();
          charWorkCount++;
        }

        // Delete character education
        const educations = await character.edge('educations');

        for (const education of educations) {
          await ctx.table('characterEducations').getX(education._id).delete();
          charEducationCount++;
        }

        // Delete other character data
        const deleteCharacterData = async (items: any[], tableName: string) => {
          for (const item of items) {
            await ctx
              .table(tableName as any)
              .getX(item._id)
              .delete();
            charOtherCount++;
          }
        };

        await deleteCharacterData(
          await character.edge('awards'),
          'characterAwards'
        );
        await deleteCharacterData(
          await character.edge('certificates'),
          'characterCertificates'
        );
        await deleteCharacterData(
          await character.edge('publications'),
          'characterPublications'
        );
        await deleteCharacterData(
          await character.edge('projects'),
          'characterProjects'
        );
        await deleteCharacterData(
          await character.edge('references'),
          'characterReferences'
        );
        await deleteCharacterData(
          await character.edge('volunteers'),
          'characterVolunteers'
        );
        await deleteCharacterData(
          await character.edge('files'),
          'characterFiles'
        );

        // Clear mainCharacterId from user if this was their main character
        const usersWithThisMain = await ctx.table(
          'users',
          'mainCharacterId',
          (q) => q.eq('mainCharacterId', character._id)
        );

        for (const user of usersWithThisMain) {
          await ctx
            .table('users')
            .getX(user._id)
            .patch({ mainCharacterId: undefined });
        }

        await ctx.table('characters').getX(character._id).delete();
      }

      console.info(
        `  🗑️ Deleted ${characters.length} characters and related data`
      );
      console.info(`     - ${charSkillCount} character skills`);
      console.info(`     - ${charWorkCount} character works`);
      console.info(`     - ${charEducationCount} character educations`);
      console.info(`     - ${charOtherCount} other character data`);

      // Delete tags
      const tags = await ctx
        .table('tags')
        .filter((q) =>
          q.or(...allUserIds.map((id) => q.eq(q.field('userId'), id)))
        );

      for (const tag of tags) {
        await ctx.table('tags').getX(tag._id).delete();
      }

      console.info(`  🗑️ Deleted ${tags.length} tags`);

      // Delete skills and related data for all users
      const skills = await ctx
        .table('skills')
        .filter((q) =>
          q.or(...allUserIds.map((id) => q.eq(q.field('userId'), id)))
        );

      let progressCount = 0;
      let skillStarCount = 0;

      for (const skill of skills) {
        // Delete skill stars by clearing them from users
        const starredByUsers = await skill.edge('starredBy');
        skillStarCount += starredByUsers.length;

        // Clear this skill from all users who starred it
        for (const user of starredByUsers) {
          await ctx
            .table('users')
            .getX(user._id)
            .patch({
              starredSkills: { remove: [skill._id] },
            });
        }

        // Delete progress
        const progresses = await skill.edge('progress');

        for (const progress of progresses) {
          await ctx.table('progress').getX(progress._id).delete();
          progressCount++;
        }

        await ctx.table('skills').getX(skill._id).delete();
      }

      console.info(`  🗑️ Deleted ${skills.length} skills and related data`);
      console.info(`     - ${progressCount} progress records`);
      console.info(`     - ${skillStarCount} skill stars`);

      // Delete projects and project members
      const projects = await ctx
        .table('projects')
        .filter((q) =>
          q.or(...allUserIds.map((id) => q.eq(q.field('userId'), id)))
        );

      for (const project of projects) {
        await ctx.table('projects').getX(project._id).delete();
      }

      console.info(`  🗑️ Deleted ${projects.length} projects`);

      // DO NOT DELETE USERS OR SESSIONS - this preserves auth!
      console.info('  ✅ Preserved users and sessions for auth continuity');
    }

    console.info('🧹 Cleanup finished');

    return null;
  },
});

// Seed users
export const seedUsers = createInternalMutation()({
  args: {},
  returns: z.array(zid('users')),
  handler: async (ctx) => {
    console.info('👤 Creating users...');

    const userIds: Id<'users'>[] = [];
    const adminConfig = getAdminConfig();
    const usersData = getUsersData(adminConfig);

    for (const userData of usersData) {
      // Check if user exists by email
      const existing = await ctx
        .table('users')
        .filter((q) => q.eq(q.field('email'), userData.email))
        .unique();

      if (existing) {
        // Update existing user (preserve session-related fields)
        const updateData: any = {
          credits: userData.credits,
          monthlyCredits: userData.monthlyCredits,
          name: userData.name,
          role: userData.role,
          username: userData.username, // Update username too
        };

        if (userData.bio !== undefined) {
          updateData.bio = userData.bio;
        }
        if (userData.profileImageUrl !== undefined) {
          updateData.profileImageUrl = userData.profileImageUrl;
        }

        await ctx.table('users').getX(existing._id).patch(updateData);
        userIds.push(existing._id);
        console.info(`  ✅ Updated user: ${userData.name}`);
      } else {
        // Create new user
        const insertData: any = {
          credits: userData.credits,
          email: userData.email,
          firstName: userData.name?.split(' ')[0],
          lastName: userData.name?.split(' ')[1],
          monthlyCredits: userData.monthlyCredits,
          name: userData.name,
          role: userData.role,
          username: userData.username,
        };

        if (userData.bio !== undefined) {
          insertData.bio = userData.bio;
        }
        if (userData.profileImageUrl !== undefined) {
          insertData.profileImageUrl = userData.profileImageUrl;
        }

        const userId = await ctx.table('users').insert(insertData);
        userIds.push(userId);
        console.info(`  ✅ Created user: ${userData.name}`);
      }
    }

    console.info('👤 Created users');

    return userIds;
  },
});

// Seed category skills
export const seedCategorySkills = createInternalMutation()({
  args: {},
  returns: z.null(),
  handler: async (ctx) => {
    console.info('🏷️ Creating category skills...');

    // Delete all existing category skills (reset)
    const existingCategories = await ctx.table('categorySkills');

    for (const category of existingCategories) {
      await ctx.table('categorySkills').getX(category._id).delete();
    }

    // Insert fresh category skills using insertMany
    await ctx.table('categorySkills').insertMany(
      categorySkillsData.map((category) => ({
        description: category.description,
        name: category.name,
        order: category.order,
      }))
    );

    console.info('🏷️ Created category skills');

    return null;
  },
});

// Seed tags
export const seedTags = createInternalMutation()({
  args: { adminId: zid('users') },
  returns: z.null(),
  handler: async (ctx, args) => {
    console.info('🏷️ Creating tags...');

    // Delete all existing tags for admin (reset)
    const adminUser = await ctx.table('users').getX(args.adminId);
    const existingTags = await adminUser.edge('tags');

    for (const tag of existingTags) {
      await ctx.table('tags').getX(tag._id).delete();
    }

    // Insert fresh tags using insertMany
    await ctx.table('tags').insertMany(
      tagData.map((tag) => ({
        color: tag.color,
        name: tag.name,
        userId: args.adminId,
      }))
    );

    console.info('🏷️ Created tags');

    return null;
  },
});

// Seed characters (main characters from seed-characters.ts)
export const seedCharacters = createInternalMutation()({
  args: { userIds: z.array(zid('users')) },
  returns: z.object({
    davidParkId: zid('characters'),
    elenaRodriguezId: zid('characters'),
  }),
  handler: async (ctx, args) => {
    console.info('👤 Creating characters...');

    const [adminId, aliceId, bobId, carolId, daveId] = args.userIds;

    // Note: Characters are already deleted in cleanupSeedData
    // This function only inserts fresh data

    // Helper function to insert character
    const insertCharacter = async (
      data: Parameters<typeof createCharacterData>[0]
    ) => {
      const id = await ctx
        .table('characters')
        .insert(createCharacterData(data));
      console.info(`  ✅ Created character: ${data.name}`);

      return id;
    };

    // Strategy characters
    await insertCharacter({
      label: 'Strategic Advisor & Business Consultant',
      name: 'Sarah Chen',
      summary:
        'Experienced strategic advisor helping companies navigate complex market challenges and drive sustainable growth.',
      userId: aliceId,
    });

    await insertCharacter({
      label: 'Corporate Strategy Director',
      name: 'Marcus Thompson',
      summary:
        'Strategic leader with a track record of developing and implementing transformative business strategies.',
      userId: bobId,
    });

    // Operations characters
    const davidParkId = await insertCharacter({
      label: 'Operations Excellence Manager',
      name: 'David Park',
      summary:
        'Operations expert specializing in process optimization and team efficiency.',
      userId: carolId,
    });

    const elenaRodriguezId = await insertCharacter({
      label: 'Supply Chain Director',
      name: 'Elena Rodriguez',
      summary:
        'Supply chain professional with expertise in global operations and logistics optimization.',
      userId: daveId,
    });

    // Leadership characters
    await insertCharacter({
      label: 'Executive Leadership Coach',
      name: 'Michael Foster',
      summary:
        'Executive coach helping leaders develop their potential and drive organizational success.',
      userId: aliceId,
    });

    await insertCharacter({
      label: 'Team Development Director',
      name: 'Lisa Wong',
      summary:
        'Leadership expert focused on building high-performing teams and fostering inclusive cultures.',
      userId: bobId,
    });

    await insertCharacter({
      label: 'Agile Scrum Master',
      name: 'Emily Chen',
      summary:
        'Experienced Scrum Master with a proven track record of leading agile teams and delivering successful projects through effective servant leadership.',
      userId: carolId,
    });

    // Research characters
    await insertCharacter({
      label: 'Market Research Analyst',
      name: 'Alex Kumar',
      summary:
        'Research specialist with expertise in market analysis and consumer behavior.',
      userId: carolId,
    });

    await insertCharacter({
      label: 'Data Science Lead',
      name: 'Emma Wilson',
      summary:
        'Data scientist specializing in predictive analytics and strategic insights.',
      userId: daveId,
    });

    // Innovation characters
    await insertCharacter({
      label: 'Innovation Director',
      name: 'James Lee',
      summary:
        'Innovation leader driving digital transformation and product development.',
      userId: aliceId,
    });

    await insertCharacter({
      label: 'R&D Manager',
      name: 'Sofia Martinez',
      summary:
        'R&D professional specializing in emerging technologies and innovative solutions.',
      userId: bobId,
    });

    // Product characters
    await insertCharacter({
      label: 'Senior Product Manager',
      name: 'Thomas Anderson',
      summary:
        'Product leader with expertise in product strategy and user-centric development.',
      userId: carolId,
    });

    await insertCharacter({
      label: 'Product Development Lead',
      name: 'Maya Patel',
      summary:
        'Product development expert focusing on innovative solutions and seamless user experiences.',
      userId: daveId,
    });

    // Design characters
    await insertCharacter({
      label: 'UX Design Director',
      name: 'Sophie Laurent',
      summary:
        'Design leader specializing in user experience and interface design.',
      userId: aliceId,
    });

    await insertCharacter({
      label: 'Creative Design Lead',
      name: 'Lucas Kim',
      summary:
        'Creative designer with a passion for innovative and impactful digital experiences.',
      userId: bobId,
    });

    // Growth characters
    await insertCharacter({
      label: 'Growth Marketing Director',
      name: 'Rachel Cohen',
      summary:
        'Growth expert specializing in data-driven marketing and user acquisition.',
      userId: carolId,
    });

    await insertCharacter({
      label: 'Growth Strategy Manager',
      name: 'Daniel Garcia',
      summary:
        'Growth strategist focused on scaling products and driving user engagement.',
      userId: daveId,
    });

    // Main characters (John Doe and Jane Doe for admin)
    const adminUser = await ctx.table('users').get(adminId);

    const johnDoeId = await insertCharacter({
      email: adminUser?.email,
      image: adminUser?.profileImageUrl || undefined,
      label: 'Senior Full Stack Developer',
      location: 'San Francisco, CA',
      name: 'John Doe',
      summary:
        'Experienced full stack developer with expertise in React, Node.js, and cloud technologies.',
      url: `https://github.com/${adminUser?.username}`,
      userId: adminId,
    });

    const janeDoeId = await insertCharacter({
      email: adminUser?.email,
      image: adminUser?.profileImageUrl || undefined,
      label: 'Senior UI/UX Designer',
      location: 'San Francisco, CA',
      name: 'Jane Doe',
      summary:
        'Creative UI/UX designer with a passion for user-centered design',
      url: `https://github.com/${adminUser?.username}`,
      userId: adminId,
    });

    // Set John Doe as admin's main character
    await ctx.table('users').getX(adminId).patch({
      mainCharacterId: johnDoeId,
    });

    // Add detailed information for John Doe
    // Note: All character-related data is already deleted in cleanupSeedData

    // Add awards using insertMany
    await ctx.table('characterAwards').insertMany([
      {
        awarder: 'Tech Excellence Awards',
        characterId: johnDoeId,
        date: new Date('2022-12-01').getTime(),
        summary: 'Recognized for outstanding technical leadership',
        title: 'Technical Excellence Award',
      },
      {
        awarder: 'Innovation Summit',
        characterId: johnDoeId,
        date: new Date('2023-06-15').getTime(),
        summary: 'Award for innovative solution in web development',
        title: 'Innovation Award',
      },
    ]);

    // Add certificate
    await ctx.table('characterCertificates').insert({
      characterId: johnDoeId,
      credentialId: 'AWS-123456',
      date: new Date('2021-06-01').getTime(),
      issuer: 'Amazon Web Services',
      name: 'AWS Certified Solutions Architect',
      url: 'https://aws.amazon.com/certification',
    });

    // Add education
    await ctx.table('characterEducations').insert({
      area: 'Computer Science',
      characterId: johnDoeId,
      courses: ['Data Structures', 'Algorithms', 'Web Development'],
      endDate: new Date('2018-05-31').getTime(),
      institution: 'Stanford University',
      score: '3.8 GPA',
      startDate: new Date('2014-09-01').getTime(),
      studyType: 'Bachelor',
    });

    console.info('👤 Created characters');

    return {
      davidParkId,
      elenaRodriguezId,
    };
  },
});

// Seed skills
export const seedSkills = createInternalMutation()({
  args: {
    adminId: zid('users'),
    userIds: z.array(zid('users')),
  },
  returns: z.object({
    devOpsSkills: z.array(zid('skills')),
    uiUxSkills: z.array(zid('skills')),
    webDevSkills: z.array(zid('skills')),
  }),
  handler: async (ctx, args) => {
    console.info('📚 Creating skills...');

    const [adminId, , , carolId, daveId] = args.userIds;

    // Note: Skills are already deleted in cleanupSeedData
    // This function only inserts fresh data

    // Create root skills for different domains
    const rootSkillsData = [
      {
        contentRich: {
          content: [
            {
              content: [
                {
                  text: 'Start your web development journey here',
                  type: 'text',
                },
              ],
              type: 'p',
            },
          ],
          type: 'doc',
        },
        description: 'Learn web development from scratch',
        difficulty: 1,
        private: false,
        published: true,
        title: 'Web Development',
        userId: adminId,
      },
      {
        contentRich: {
          content: [
            {
              content: [
                { text: 'Start your design journey here', type: 'text' },
              ],
              type: 'p',
            },
          ],
          type: 'doc',
        },
        description: 'Master UI/UX design principles',
        difficulty: 1,
        private: false,
        published: true,
        title: 'UI/UX Design',
        userId: carolId,
      },
      {
        contentRich: {
          content: [
            {
              content: [
                { text: 'Start your DevOps journey here', type: 'text' },
              ],
              type: 'p',
            },
          ],
          type: 'doc',
        },
        description: 'Learn DevOps practices',
        difficulty: 2,
        private: false,
        published: true,
        title: 'DevOps',
        userId: daveId,
      },
    ];

    const rootSkillIds = await ctx.table('skills').insertMany(rootSkillsData);
    const [webDevSkillId, uiUxSkillId, devOpsSkillId] = rootSkillIds;

    for (const skillData of rootSkillsData) {
      console.info(`  ✅ Created skill: ${skillData.title}`);
    }

    // Create child skills for web development
    const webDevChildData = [
      { description: 'Learn HTML basics', difficulty: 1, title: 'HTML' },
      { description: 'Learn CSS basics', difficulty: 2, title: 'CSS' },
      {
        description: 'Learn JavaScript basics',
        difficulty: 3,
        title: 'JavaScript',
      },
    ];

    const webDevSkills = await ctx.table('skills').insertMany(
      webDevChildData.map((skillData) => ({
        contentRich: {
          content: [
            {
              content: [{ text: `Learn ${skillData.title}`, type: 'text' }],
              type: 'p',
            },
          ],
          type: 'doc',
        },
        description: skillData.description,
        difficulty: skillData.difficulty,
        parentSkillId: webDevSkillId,
        private: false,
        published: true,
        rootSkillId: webDevSkillId,
        title: skillData.title,
        userId: adminId,
      }))
    );

    for (const skillData of webDevChildData) {
      console.info(`  ✅ Created skill: ${skillData.title}`);
    }

    // Create child skills for UI/UX
    const uiUxChildData = [
      {
        description: 'Learn user research methods',
        difficulty: 1,
        title: 'User Research',
      },
      {
        description: 'Learn wireframing techniques',
        difficulty: 2,
        title: 'Wireframing',
      },
      {
        description: 'Learn prototyping tools',
        difficulty: 2,
        title: 'Prototyping',
      },
    ];

    const uiUxSkills = await ctx.table('skills').insertMany(
      uiUxChildData.map((skillData) => ({
        contentRich: {
          content: [
            {
              content: [{ text: `Learn ${skillData.title}`, type: 'text' }],
              type: 'p',
            },
          ],
          type: 'doc',
        },
        description: skillData.description,
        difficulty: skillData.difficulty,
        parentSkillId: uiUxSkillId,
        private: false,
        published: true,
        rootSkillId: uiUxSkillId,
        title: skillData.title,
        userId: carolId,
      }))
    );

    for (const skillData of uiUxChildData) {
      console.info(`  ✅ Created skill: ${skillData.title}`);
    }

    // Create child skills for DevOps
    const devOpsChildData = [
      {
        description: 'Learn Docker containerization',
        difficulty: 2,
        title: 'Docker',
      },
      {
        description: 'Learn Kubernetes orchestration',
        difficulty: 3,
        title: 'Kubernetes',
      },
      {
        description: 'Learn continuous integration and deployment',
        difficulty: 2,
        title: 'CI/CD',
      },
    ];

    const devOpsSkills = await ctx.table('skills').insertMany(
      devOpsChildData.map((skillData) => ({
        contentRich: {
          content: [
            {
              content: [{ text: `Learn ${skillData.title}`, type: 'text' }],
              type: 'p',
            },
          ],
          type: 'doc',
        },
        description: skillData.description,
        difficulty: skillData.difficulty,
        parentSkillId: devOpsSkillId,
        private: false,
        published: true,
        rootSkillId: devOpsSkillId,
        title: skillData.title,
        userId: daveId,
      }))
    );

    for (const skillData of devOpsChildData) {
      console.info(`  ✅ Created skill: ${skillData.title}`);
    }

    // Create skill dependencies using the new many-to-many edge structure
    // For web dev skills (HTML -> CSS -> JavaScript)
    for (let i = 1; i < webDevSkills.length; i++) {
      const dependentSkill = await ctx.table('skills').getX(webDevSkills[i]);
      await dependentSkill.patch({
        dependencies: { add: [webDevSkills[i - 1]] }, // This skill depends on the previous one
      });
    }

    // For UI/UX skills (User Research -> Wireframing -> Prototyping)
    for (let i = 1; i < uiUxSkills.length; i++) {
      const dependentSkill = await ctx.table('skills').getX(uiUxSkills[i]);
      await dependentSkill.patch({
        dependencies: { add: [uiUxSkills[i - 1]] }, // This skill depends on the previous one
      });
    }

    // For DevOps skills (Docker -> Kubernetes -> CI/CD)
    for (let i = 1; i < devOpsSkills.length; i++) {
      const dependentSkill = await ctx.table('skills').getX(devOpsSkills[i]);
      await dependentSkill.patch({
        dependencies: { add: [devOpsSkills[i - 1]] }, // This skill depends on the previous one
      });
    }

    console.info('📚 Created skills');

    return {
      devOpsSkills,
      uiUxSkills,
      webDevSkills,
    };
  },
});

// Seed character relationships and skills
export const seedCharacterRelationships = createInternalMutation()({
  args: {
    characterIds: z.object({
      davidParkId: zid('characters'),
      elenaRodriguezId: zid('characters'),
    }),
    skillIds: z.object({
      devOpsSkills: z.array(zid('skills')),
      uiUxSkills: z.array(zid('skills')),
      webDevSkills: z.array(zid('skills')),
    }),
    userIds: z.array(zid('users')),
  },
  returns: z.null(),
  handler: async (ctx, args) => {
    console.info('🔗 Creating character relationships...');

    // Get characters
    const characters = await ctx
      .table('characters')
      .filter((q) =>
        q.or(...args.userIds.map((id) => q.eq(q.field('userId'), id)))
      );

    // Get skills by ID for mapping
    const allSkillIds = [
      ...args.skillIds.webDevSkills,
      ...args.skillIds.uiUxSkills,
      ...args.skillIds.devOpsSkills,
    ];

    const skills = await Promise.all(
      allSkillIds.map((id) => ctx.table('skills').get(id))
    );

    const skillMap = new Map(
      skills.filter(Boolean).map((s) => [s!.title, s!._id])
    );

    // Note: Character skills are already deleted in cleanupSeedData
    // This function only inserts fresh data

    // Collect all character skills to insert
    const characterSkillsToInsert: EntInsertMany<'characterSkills'> = [];

    // Add skills to characters
    for (const character of characters) {
      if (character.label?.includes('Developer')) {
        // Add JavaScript skill if it exists
        const jsSkillId = skillMap.get('JavaScript');

        if (jsSkillId) {
          characterSkillsToInsert.push({
            characterId: character._id,
            isInterest: false,
            isSkill: true,
            level: '4',
            name: 'JavaScript',
            skillId: jsSkillId,
          });
        }

        // Add generic React skill
        characterSkillsToInsert.push(
          {
            characterId: character._id,
            isInterest: false,
            isSkill: true,
            level: '4',
            name: 'React',
          },
          {
            characterId: character._id,
            isInterest: true,
            isSkill: true,
            level: '4',
            name: 'Node.js',
          }
        );

        // Add HTML and CSS if available
        const htmlSkillId = skillMap.get('HTML');

        if (htmlSkillId) {
          characterSkillsToInsert.push({
            characterId: character._id,
            isInterest: false,
            isSkill: true,
            level: '5',
            name: 'HTML',
            skillId: htmlSkillId,
          });
        }

        const cssSkillId = skillMap.get('CSS');

        if (cssSkillId) {
          characterSkillsToInsert.push({
            characterId: character._id,
            isInterest: false,
            isSkill: true,
            level: '4',
            name: 'CSS',
            skillId: cssSkillId,
          });
        }
      } else if (character.label?.includes('UI/UX')) {
        // Add UI/UX skills
        const userResearchId = skillMap.get('User Research');

        if (userResearchId) {
          characterSkillsToInsert.push({
            characterId: character._id,
            isInterest: false,
            isSkill: true,
            level: '4',
            name: 'User Research',
            skillId: userResearchId,
          });
        }

        const prototypingId = skillMap.get('Prototyping');

        if (prototypingId) {
          characterSkillsToInsert.push({
            characterId: character._id,
            isInterest: true,
            isSkill: true,
            level: '4',
            name: 'Prototyping',
            skillId: prototypingId,
          });
        }

        const wireframingId = skillMap.get('Wireframing');

        if (wireframingId) {
          characterSkillsToInsert.push({
            characterId: character._id,
            isInterest: false,
            isSkill: true,
            level: '4',
            name: 'Wireframing',
            skillId: wireframingId,
          });
        }
      } else if (character.label?.includes('DevOps')) {
        // Add DevOps skills
        const dockerId = skillMap.get('Docker');

        if (dockerId) {
          characterSkillsToInsert.push({
            characterId: character._id,
            isInterest: true,
            isSkill: true,
            level: '3',
            name: 'Docker',
            skillId: dockerId,
          });
        }
      } else if (
        character.label?.includes('Strategy') ||
        character.label?.includes('Leadership')
      ) {
        // Add strategy/leadership skills as category skills
        characterSkillsToInsert.push(
          {
            characterId: character._id,
            isInterest: false,
            isSkill: true,
            level: '5',
            name: 'Strategy',
          },
          {
            characterId: character._id,
            isInterest: false,
            isSkill: true,
            level: '4',
            name: 'Leadership',
          }
        );
      } else if (
        character.label?.includes('Research') ||
        character.label?.includes('Data Science')
      ) {
        // Add research skills
        characterSkillsToInsert.push({
          characterId: character._id,
          isInterest: false,
          isSkill: true,
          level: '5',
          name: 'Research',
        });

        characterSkillsToInsert.push({
          characterId: character._id,
          isInterest: false,
          isSkill: true,
          level: character.label?.includes('Data Science') ? '4' : '3',
          name: character.label?.includes('Data Science')
            ? 'Innovation'
            : 'Strategy',
        });
      } else if (
        character.label?.includes('Innovation') ||
        character.label?.includes('R&D')
      ) {
        // Add innovation skills
        characterSkillsToInsert.push({
          characterId: character._id,
          isInterest: false,
          isSkill: true,
          level: '5',
          name: 'Innovation',
        });

        characterSkillsToInsert.push({
          characterId: character._id,
          isInterest: false,
          isSkill: true,
          level: character.label?.includes('R&D') ? '4' : '3',
          name: character.label?.includes('R&D') ? 'Research' : 'Leadership',
        });
      } else if (character.label?.includes('Product')) {
        // Add product skills
        characterSkillsToInsert.push({
          characterId: character._id,
          isInterest: false,
          isSkill: true,
          level: '5',
          name: 'Product',
        });

        characterSkillsToInsert.push({
          characterId: character._id,
          isInterest: false,
          isSkill: true,
          level: '4',
          name: character.label?.includes('Development')
            ? 'Design'
            : 'Strategy',
        });
      } else if (
        character.label?.includes('Design') &&
        !character.label?.includes('UI/UX')
      ) {
        // Add design skills for non-UI/UX designers
        characterSkillsToInsert.push({
          characterId: character._id,
          isInterest: false,
          isSkill: true,
          level: '5',
          name: 'Design',
        });

        characterSkillsToInsert.push({
          characterId: character._id,
          isInterest: false,
          isSkill: true,
          level: '4',
          name: character.label?.includes('Creative')
            ? 'Innovation'
            : 'Product',
        });
      } else if (character.label?.includes('Growth')) {
        // Add growth skills
        characterSkillsToInsert.push({
          characterId: character._id,
          isInterest: false,
          isSkill: true,
          level: '5',
          name: 'Growth',
        });

        characterSkillsToInsert.push({
          characterId: character._id,
          isInterest: false,
          isSkill: true,
          level: '4',
          name: character.label?.includes('Marketing') ? 'Strategy' : 'Product',
        });
      }
      // Add Operations skills to specific characters
      if (character._id === args.characterIds.davidParkId) {
        characterSkillsToInsert.push(
          {
            characterId: character._id,
            isInterest: false,
            isSkill: true,
            level: '5',
            name: 'Operations',
          },
          {
            characterId: character._id,
            isInterest: false,
            isSkill: true,
            level: '4',
            name: 'Leadership',
          }
        );
      } else if (character._id === args.characterIds.elenaRodriguezId) {
        characterSkillsToInsert.push(
          {
            characterId: character._id,
            isInterest: false,
            isSkill: true,
            level: '5',
            name: 'Operations',
          },
          {
            characterId: character._id,
            isInterest: false,
            isSkill: true,
            level: '3',
            name: 'Research',
          }
        );
      }
    }

    // Insert all character skills using insertMany
    if (characterSkillsToInsert.length > 0) {
      await ctx.table('characterSkills').insertMany(characterSkillsToInsert);
    }

    console.info('🔗 Created character relationships');

    return null;
  },
});

// Seed social data
export const seedSocialData = createInternalMutation()({
  args: {
    adminId: zid('users'),
    skillIds: z.object({
      devOpsSkills: z.array(zid('skills')),
      uiUxSkills: z.array(zid('skills')),
      webDevSkills: z.array(zid('skills')),
    }),
    userIds: z.array(zid('users')),
  },
  returns: z.null(),
  handler: async (ctx, args) => {
    console.info('💬 Creating social data...');

    const [adminId, ...otherUserIds] = args.userIds;

    // Note: User follows are already deleted in cleanupSeedData
    // Create user follows (everyone follows admin) using edge patches
    for (const userId of otherUserIds) {
      const user = await ctx.table('users').getX(userId);
      await user.patch({
        following: { add: [adminId] },
      });
    }

    // Create character stars using the new many-to-many edge structure
    const characters = await ctx
      .table('characters')
      .filter((q) =>
        q.or(...args.userIds.map((id) => q.eq(q.field('userId'), id)))
      )
      .take(5);

    // Each user stars some characters
    for (const character of characters) {
      for (const userId of otherUserIds.slice(0, 2)) {
        if (userId !== character.userId) {
          const user = await ctx.table('users').getX(userId);
          await user.patch({
            starredCharacters: { add: [character._id] },
          });
        }
      }
    }

    // Note: Skill stars are already deleted in cleanupSeedData
    // Create skill stars
    const allSkillIds = [
      ...args.skillIds.webDevSkills,
      ...args.skillIds.uiUxSkills,
      ...args.skillIds.devOpsSkills,
    ];

    // Each user (except admin) stars some skills using edge patches
    for (const userId of otherUserIds.slice(0, 3)) {
      const user = await ctx.table('users').getX(userId);
      await user.patch({
        starredSkills: { add: allSkillIds },
      });
    }

    // Note: Progress records are already deleted in cleanupSeedData
    // Create some progress records using insertMany
    const progressRecords: EntInsertMany<'progress'> = [];
    const now = Date.now();

    for (const skillId of allSkillIds.slice(0, 3)) {
      for (const userId of otherUserIds.slice(0, 2)) {
        progressRecords.push({
          completedAt: now,
          level: '3',
          manualCheck: true,
          skillId,
          timeSpent: 3600,
          userId,
        });
      }
    }

    if (progressRecords.length > 0) {
      await ctx.table('progress').insertMany(progressRecords);
    }

    // Note: Notifications are already deleted in cleanupSeedData
    // Create notifications
    const skills = await Promise.all(
      allSkillIds.slice(0, 5).map((id) => ctx.table('skills').get(id))
    );

    // Create notifications using insertMany
    const notifications = skills
      .filter((skill) => skill && otherUserIds.length > 0)
      .map((skill) => ({
        message: `Congratulations! You've completed ${skill!.title}`,
        read: false,
        senderId: adminId,
        skillId: skill!._id,
        type: 'SKILL_COMPLETED' as const,
        userId: otherUserIds[0], // Alice
      }));

    if (notifications.length > 0) {
      await ctx.table('notifications').insertMany(notifications);
    }

    console.info('💬 Created social data');

    return null;
  },
});

// Seed projects and project members
export const seedProjects = createInternalMutation()({
  args: {
    adminId: zid('users'),
    userIds: z.array(zid('users')),
  },
  returns: z.null(),
  handler: async (ctx, args) => {
    console.info('📋 Creating projects...');

    const [adminId, aliceId, bobId, carolId, daveId] = args.userIds;

    // Create projects for different users
    const projectsData = [
      {
        instructions:
          'Build a platform for creating and interacting with AI characters',
        title: 'AI Character Platform',
        userId: aliceId,
      },
      {
        instructions: 'Set up scalable backend services and APIs',
        title: 'Backend Infrastructure',
        userId: bobId,
      },
      {
        instructions: 'Create a comprehensive design system for our products',
        title: 'Design System',
        userId: carolId,
      },
    ];

    for (const projectData of projectsData) {
      // Create project
      const projectId = await ctx.table('projects').insert(projectData);

      // Add creator as first member (already accepted)
      await ctx.table('projectMembers').insert({
        acceptedAt: Date.now(),
        invitedBy: projectData.userId,
        projectId,
        userId: projectData.userId,
      });

      // Add some accepted members
      if (projectData.userId === aliceId) {
        // Bob is an accepted member in Alice's project
        await ctx.table('projectMembers').insert({
          acceptedAt: Date.now() - 1000 * 60 * 60 * 24, // Accepted 1 day ago
          invitedBy: aliceId,
          projectId,
          userId: bobId,
        });
      } else if (projectData.userId === bobId) {
        // Carol is an accepted member in Bob's project
        await ctx.table('projectMembers').insert({
          acceptedAt: Date.now() - 1000 * 60 * 60 * 48, // Accepted 2 days ago
          invitedBy: bobId,
          projectId,
          userId: carolId,
        });

        // Dave is an accepted member in Bob's project
        await ctx.table('projectMembers').insert({
          acceptedAt: Date.now() - 1000 * 60 * 60 * 72, // Accepted 3 days ago
          invitedBy: bobId,
          projectId,
          userId: daveId,
        });
      }

      // Add pending invitation for admin to each project
      await ctx.table('projectMembers').insert({
        acceptedAt: undefined, // Pending invitation
        invitedBy: projectData.userId,
        projectId,
        userId: adminId,
      });

      // Create invitation notification for admin
      await ctx.table('notifications').insert({
        message: `You have been invited to join the project "${projectData.title}"`,
        projectId,
        read: false,
        senderId: projectData.userId,
        type: 'PROJECT_INVITATION',
        userId: adminId,
      });

      // Create sample chats for each project
      const chatData = [
        {
          lastMessageTime: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
          title: 'Project Planning',
        },
        {
          lastMessageTime: Date.now() - 1000 * 60 * 60 * 8, // 8 hours ago
          title: 'Technical Discussion',
        },
        {
          lastMessageTime: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
          title: 'Daily Standup Notes',
        },
      ];

      for (const chat of chatData) {
        const chatId = await ctx.table('chats').insert({
          customId: generateId(),
          lastMessageAt: chat.lastMessageTime,
          projectId,
          title: chat.title,
          userId: projectData.userId,
          visibility: 'private',
        });

        // Add sample messages to each chat
        const messages = getSampleMessages(
          chat.title,
          projectData.userId,
          chat.lastMessageTime
        );

        const messageData = messages.map((message) => ({
          chatId,
          customId: generateId(),
          parts: message.parts,
          role: message.role,
          userId: message.userId,
        }));

        if (messageData.length > 0) {
          await ctx.table('messages').insertMany(messageData);
        }
      }
    }

    console.info('📋 Created projects with members and invitations');

    return null;
  },
});

// Seed recent chats (chats without projects)
export const seedRecentChats = createInternalMutation()({
  args: {
    userId: zid('users'),
  },
  returns: z.null(),
  handler: async (ctx, args) => {
    console.info('💬 Creating recent chats...');

    const currentTime = Date.now();

    // Sample recent chats data
    const recentChatsData = [
      {
        createdTime: currentTime - 1000 * 60 * 60 * 2, // 2 hours ago
        lastMessageTime: currentTime - 1000 * 60 * 30, // 30 minutes ago
        title: 'Personal Brainstorming',
      },
      {
        createdTime: currentTime - 1000 * 60 * 60 * 8, // 8 hours ago
        lastMessageTime: currentTime - 1000 * 60 * 60 * 4, // 4 hours ago
        title: 'Quick Questions',
      },
      {
        createdTime: currentTime - 1000 * 60 * 60 * 48, // 2 days ago
        lastMessageTime: currentTime - 1000 * 60 * 60 * 24, // 1 day ago
        title: 'Daily Notes',
      },
      {
        createdTime: currentTime - 1000 * 60 * 60 * 72, // 3 days ago
        lastMessageTime: currentTime - 1000 * 60 * 60 * 36, // 1.5 days ago
        title: 'Learning Journal',
      },
    ];

    for (const chat of recentChatsData) {
      // Create chat without projectId to make it a "recent chat"
      const chatId = await ctx.table('chats').insert({
        customId: generateId(),
        lastMessageAt: chat.lastMessageTime,
        projectId: undefined, // No project association
        title: chat.title,
        userId: args.userId,
        visibility: 'private',
      });

      // Add sample messages to each chat using existing helper
      const messages = getSampleMessages(
        chat.title,
        args.userId,
        chat.createdTime
      );

      const messageData = messages.map((message) => ({
        chatId,
        customId: generateId(),
        parts: message.parts,
        role: message.role,
        userId: message.userId,
      }));

      if (messageData.length > 0) {
        await ctx.table('messages').insertMany(messageData);
      }
    }

    console.info('💬 Created recent chats');

    return null;
  },
});

// Run the seed - this can be called from the Convex dashboard
// npx convex run seed:seed
