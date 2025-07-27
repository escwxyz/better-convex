/* eslint-disable perfectionist/sort-objects */
import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents';
import { v } from 'convex/values';

// Enums
const userRoleEnum = v.union(
  v.literal('USER'),
  v.literal('ADMIN'),
  v.literal('SUPERADMIN')
);

const notificationTypeEnum = v.union(
  v.literal('FOLLOW'),
  v.literal('MENTION'),
  v.literal('COMMENT'),
  v.literal('STAR'),
  v.literal('SKILL_COMPLETED'),
  v.literal('PROJECT_INVITATION')
);

const reportStatusEnum = v.union(
  v.literal('PENDING'),
  v.literal('RESOLVED'),
  v.literal('DISMISSED')
);

const documentTypeEnum = v.union(
  v.literal('SKILL'),
  v.literal('RESOURCE'),
  v.literal('CHAT'),
  v.literal('OTHER')
);

const schema = defineEntSchema(
  {
    // --------------------
    // Category Skills (Admin Managed)
    // --------------------
    categorySkills: defineEnt({
      description: v.optional(v.string()),
    })
      .field('name', v.string(), { unique: true })
      .field('order', v.number(), { index: true }),

    // --------------------
    // Core User & Session Models
    // --------------------
    users: defineEnt({
      // Auth fields (Better-Auth)
      // Profile fields
      name: v.optional(v.string()),
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      image: v.optional(v.string()), // Better-Auth expects 'image'
      profileImageUrl: v.optional(v.string()), // Backward compatibility
      bio: v.optional(v.string()),
      location: v.optional(v.string()),
      website: v.optional(v.string()),
      x: v.optional(v.string()),
      github: v.optional(v.string()),
      linkedin: v.optional(v.string()),

      // Credits & Subscription
      monthlyCreditsPeriodStart: v.optional(v.number()),
      stripeSubscriptionId: v.optional(v.string()),
      stripeSubscriptionStatus: v.optional(v.string()),
      stripePriceId: v.optional(v.string()),
      stripeCurrentPeriodStart: v.optional(v.number()),
      stripeCurrentPeriodEnd: v.optional(v.number()),
      stripeCancelAtPeriodEnd: v.optional(v.boolean()),

      // Timestamps
      usernameUpdatedAt: v.optional(v.number()),
      deletedAt: v.optional(v.number()),
    })
      .field('emailVerified', v.boolean(), { default: false })
      .field('role', userRoleEnum, { default: 'USER' })
      .field('credits', v.number(), { default: 0 })
      .field('monthlyCredits', v.number(), { default: 0 })
      .field('monthlyCreditsPeriodCount', v.number(), { default: 0 })
      .field('email', v.string(), { unique: true })
      .field('username', v.string(), { index: true })
      .field('stripeCustomerId', v.optional(v.string()), { index: true })
      .field('mainCharacterId', v.optional(v.id('characters')), {
        index: true,
      })
      .edges('purchases', { ref: true })
      .edges('following', {
        to: 'users',
        inverse: 'followers',
        table: 'follows',
        field: 'followerId',
        inverseField: 'followingId',
      })
      .edges('characters', { ref: 'userId' })
      .edges('chats', { ref: true })
      .edges('messages', { ref: true })
      .edges('skillSettings', { ref: true })
      .edges('skills', { ref: true })
      .edges('starredCharacters', {
        to: 'characters',
        table: 'characterStars',
        field: 'characterId',
      })
      .edges('characterActivities', { ref: true })
      .edges('notifications', { ref: 'userId' })
      .edges('sentNotifications', { to: 'notifications', ref: 'senderId' })
      .edges('reportsSent', { to: 'reports', ref: 'reportedByUserId' })
      .edges('reportsReceived', { to: 'reports', ref: 'userId' })
      .edges('devSettings', { ref: true })
      .edges('learningPaths', { ref: true })
      .edges('progress', { ref: true })
      .edges('starredSkills', {
        to: 'skills',
        table: 'skillStars',
        field: 'skillId',
      })
      .edges('upvotedComments', {
        to: 'comments',
        table: 'commentUpvotes',
        field: 'commentId',
      })
      .edges('tags', { ref: true })
      .edges('documents', { ref: true })
      .edges('comments', { ref: true })
      .edges('votedMessages', { ref: true, to: 'messageVotes' })
      .edges('projects', { to: 'projects', ref: true })
      .edges('projectMembers', { to: 'projectMembers', ref: 'userId' })
      .edges('invitedProjectMembers', {
        to: 'projectMembers',
        ref: 'invitedBy',
      })
      .edges('starredProjects', {
        to: 'projects',
        table: 'projectStars',
        field: 'projectId',
      })
      .index('username_name', ['username', 'name'])
      .searchIndex('search_username_name', {
        searchField: 'name',
        filterFields: ['username'],
      }),
    // .edge('mainCharacter', {
    //   to: 'characters',
    //   field: 'mainCharacterId',
    //   optional: true,
    // }),

    // Purchase tracking
    purchases: defineEnt({
      creditAmount: v.number(),
      stripeEventId: v.optional(v.string()),
    }).edge('user'),

    // --------------------
    // Character & Associated Models
    // --------------------
    characters: defineEnt({
      // Basics
      name: v.string(),
      image: v.optional(v.string()),
      label: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      url: v.optional(v.string()),
      summary: v.optional(v.string()),
      location: v.optional(v.string()),

      // Location details
      address: v.optional(v.string()),
      postalCode: v.optional(v.string()),
      city: v.optional(v.string()),
      countryCode: v.optional(v.string()),
      region: v.optional(v.string()),

      // Arrays & settings
      profiles: v.optional(v.any()), // JSON
      categories: v.optional(v.array(v.string())), // Denormalized skill categories for efficient filtering
      awardsHide: v.boolean(),
      certificatesHide: v.boolean(),
      educationHide: v.boolean(),
      interestsHide: v.boolean(),
      languagesHide: v.boolean(),
      projectsHide: v.boolean(),
      publicationsHide: v.boolean(),
      referencesHide: v.boolean(),
      skillsHide: v.boolean(),
      volunteerHide: v.boolean(),
      workHide: v.boolean(),
      meta: v.optional(v.any()), // JSON
    })
      .field('private', v.boolean(), { index: true })
      .field('mainPersonaId', v.optional(v.any()), {
        index: true,
      })
      .edge('user')
      .edges('works', { to: 'characterWorks', ref: true })
      .edges('volunteers', { to: 'characterVolunteers', ref: true })
      .edges('educations', { to: 'characterEducations', ref: true })
      .edges('awards', { to: 'characterAwards', ref: true })
      .edges('certificates', { to: 'characterCertificates', ref: true })
      .edges('publications', { to: 'characterPublications', ref: true })
      .edges('characterProjects', { to: 'characterProjects', ref: true })
      .edges('references', { to: 'characterReferences', ref: true })
      .edges('files', { to: 'characterFiles', ref: true })
      .edges('skills', { to: 'characterSkills', ref: true })
      .edges('personas', { to: 'personas', ref: true })
      .edges('chats', { ref: 'characterId' })
      .edges('chatCharacters', { ref: true })
      .edges('messages', { ref: true })
      .edges('activity', { to: 'characterActivities', ref: true })
      .edges('reports', { ref: 'characterId' })
      .edges('starredBy', {
        to: 'users',
        table: 'characterStars',
        field: 'userId',
      })
      .edges('projects', {
        to: 'projects',
        table: 'projectCharacters',
        field: 'characterId',
        inverseField: 'projectId',
      })
      .index('private_categories', ['private', 'categories'])
      .index('name_label', ['name', 'label'])
      .searchIndex('search_name', {
        searchField: 'name',
        filterFields: ['userId', 'private'],
      }),

    // --------------------
    // Character Personas
    // --------------------
    personas: defineEnt({
      // AI Configuration
      model: v.optional(v.string()),
      instructions: v.optional(v.string()),
      conversationStarters: v.optional(v.array(v.string())),
      files: v.optional(v.array(v.any())), // JSON array of file info
    }).edge('character', { field: 'characterId' }),

    characterWorks: defineEnt({
      description: v.optional(v.string()),
      employmentType: v.optional(v.string()),
      endDate: v.optional(v.number()),
      highlights: v.optional(v.any()), // JSON array
      location: v.optional(v.string()),
      locationType: v.optional(v.string()),
      name: v.optional(v.string()),
      position: v.optional(v.string()),
      startDate: v.optional(v.number()),
      summary: v.optional(v.string()),
      url: v.optional(v.string()),
    })
      .edge('character')
      .edges('skills', {
        to: 'characterSkills',
        table: 'characterWorkSkills',
        field: 'workId',
        inverseField: 'characterSkillId',
      })
      .index('characterId_endDate', ['characterId', 'endDate']),

    characterVolunteers: defineEnt({
      cause: v.optional(v.string()),
      endDate: v.optional(v.number()),
      highlights: v.optional(v.any()), // JSON array
      organization: v.optional(v.string()),
      position: v.optional(v.string()),
      startDate: v.optional(v.number()),
      summary: v.optional(v.string()),
      url: v.optional(v.string()),
    })
      .edge('character')
      .index('characterId_endDate', ['characterId', 'endDate']),

    characterEducations: defineEnt({
      area: v.optional(v.string()),
      courses: v.optional(v.any()), // JSON array
      endDate: v.optional(v.number()),
      institution: v.optional(v.string()),
      score: v.optional(v.string()),
      startDate: v.optional(v.number()),
      studyType: v.optional(v.string()),
      summary: v.optional(v.string()),
      url: v.optional(v.string()),
    })
      .edge('character')
      .edges('skills', {
        to: 'characterSkills',
        table: 'characterEducationSkills',
        field: 'educationId',
        inverseField: 'characterSkillId',
      })
      .index('characterId_endDate', ['characterId', 'endDate']),

    characterAwards: defineEnt({
      awarder: v.optional(v.string()),
      date: v.optional(v.number()),
      summary: v.optional(v.string()),
      title: v.optional(v.string()),
    })
      .edge('character')
      .index('characterId_date', ['characterId', 'date']),

    characterCertificates: defineEnt({
      credentialId: v.optional(v.string()),
      expireDate: v.optional(v.number()),
      date: v.optional(v.number()),
      issuer: v.optional(v.string()),
      name: v.optional(v.string()),
      url: v.optional(v.string()),
    })
      .edge('character')
      .edges('skills', {
        to: 'characterSkills',
        table: 'characterCertificateSkills',
        field: 'certificateId',
        inverseField: 'characterSkillId',
      })
      .index('characterId_date', ['characterId', 'date']),

    characterPublications: defineEnt({
      name: v.optional(v.string()),
      publisher: v.optional(v.string()),
      releaseDate: v.optional(v.number()),
      summary: v.optional(v.string()),
      url: v.optional(v.string()),
    })
      .edge('character')
      .index('characterId_releaseDate', ['characterId', 'releaseDate']),

    characterProjects: defineEnt({
      description: v.optional(v.string()),
      endDate: v.optional(v.number()),
      entity: v.optional(v.string()),
      highlights: v.optional(v.any()), // JSON array
      name: v.optional(v.string()),
      roles: v.optional(v.any()), // JSON array
      startDate: v.optional(v.number()),
      summary: v.optional(v.string()),
      type: v.optional(v.string()),
      url: v.optional(v.string()),
    })
      .edge('character')
      .edges('skills', {
        to: 'characterSkills',
        table: 'characterProjectSkills',
        field: 'projectId',
        inverseField: 'characterSkillId',
      })
      .index('characterId_endDate', ['characterId', 'endDate'])
      .index('characterId_startDate', ['characterId', 'startDate']),

    characterReferences: defineEnt({
      name: v.string(),
      reference: v.string(),
    }).edge('character'),

    characterFiles: defineEnt({
      name: v.string(),
      type: v.string(),
      url: v.string(),
      charCount: v.number(),
    }).edge('character'),

    characterSkills: defineEnt({
      characterId: v.id('characters'),
      skillId: v.optional(v.id('skills')),
      type: v.optional(v.string()), // 'language' for language skills
      level: v.optional(v.string()),
      interestLevel: v.optional(v.string()),
      isSkill: v.boolean(),
      isInterest: v.boolean(),
    })
      .field('name', v.string(), { index: true })
      .edge('character')
      .edge('skill', { field: 'skillId', optional: true })
      .edges('works', {
        to: 'characterWorks',
        table: 'characterWorkSkills',
        field: 'characterSkillId',
        inverseField: 'workId',
      })
      .edges('educations', {
        to: 'characterEducations',
        table: 'characterEducationSkills',
        field: 'characterSkillId',
        inverseField: 'educationId',
      })
      .edges('certificates', {
        to: 'characterCertificates',
        table: 'characterCertificateSkills',
        field: 'characterSkillId',
        inverseField: 'certificateId',
      })
      .edges('projects', {
        to: 'characterProjects',
        table: 'characterProjectSkills',
        field: 'characterSkillId',
        inverseField: 'projectId',
      })
      .index('characterId_skillId', ['characterId', 'skillId'])
      .index('characterId_name', ['characterId', 'name'])
      .index('characterId_type_isSkill', ['characterId', 'type', 'isSkill']),

    // --------------------
    // Chat & Message Models
    // --------------------
    chats: defineEnt({
      title: v.optional(v.string()),
      visibility: v.string(),
      characterId: v.optional(v.id('characters')),
      projectId: v.optional(v.id('projects')),
      lastMessageAt: v.number(),
    })
      .field('customId', v.string(), { index: true })
      .edge('user')
      .edge('character', { field: 'characterId', optional: true })
      .edge('project', {
        to: 'projects',
        field: 'projectId',
        optional: true,
      })
      .edges('messages', { ref: true })
      .edges('chatCharacters', { ref: true })
      .index('userId_lastMessageAt', ['userId', 'lastMessageAt'])
      .index('userId_characterId', ['userId', 'characterId']),

    // Track last message time per user-character pair
    characterActivities: defineEnt({
      lastMessageAt: v.number(),
    })
      .edge('user')
      .edge('character')
      .index('userId_characterId', ['userId', 'characterId']),

    chatCharacters: defineEnt({
      joinedAt: v.number(),
    })
      .edge('chat')
      .edge('character')
      .index('chatId_characterId', ['chatId', 'characterId']),

    messages: defineEnt({
      role: v.string(),
      parts: v.optional(v.any()), // JSON
      annotations: v.optional(v.any()), // JSON

      // Branch management
      branchId: v.optional(v.union(v.null(), v.string())),
    })
      .field('parentId', v.optional(v.union(v.null(), v.string())), {
        index: true,
      })
      .field('customId', v.string(), { index: true })
      .edge('chat')
      .edge('user', { field: 'userId', optional: true })
      .edge('character', { field: 'characterId', optional: true })
      .edges('votedBy', { to: 'messageVotes', ref: 'messageId' }),

    // --------------------
    // Project Models
    // --------------------
    projects: defineEnt({
      title: v.string(),
      instructions: v.optional(v.string()),
      color: v.optional(v.string()), // Hex color for folder icon (e.g. "#64748b")
    })
      .edge('user')
      .edges('members', { to: 'projectMembers', ref: true })
      .edges('notifications', { to: 'notifications', ref: 'projectId' })
      .edges('chats', { ref: 'projectId' })
      .edges('characters', {
        to: 'characters',
        table: 'projectCharacters',
        field: 'projectId',
        inverseField: 'characterId',
      })
      .edges('starredBy', {
        to: 'users',
        table: 'projectStars',
        field: 'userId',
      })
      .searchIndex('search_title', {
        searchField: 'title',
        filterFields: ['userId'],
      }),

    projectMembers: defineEnt({
      acceptedAt: v.optional(v.number()),
      invitedBy: v.optional(v.id('users')),
    })
      .edge('project')
      .edge('user')
      .edge('inviter', { to: 'users', field: 'invitedBy', optional: true })
      .index('projectId_userId', ['projectId', 'userId']),

    // --------------------
    // Document Model (Centralized Rich Content)
    // --------------------
    documents: defineEnt({
      title: v.string(),
      content: v.string(),
      contentRich: v.optional(v.any()), // JSON rich content
      isPrimary: v.boolean(),
      votes: v.number(),
    })
      .field('type', documentTypeEnum, { index: true })
      .edge('user', { field: 'userId', optional: true })
      .edge('skill', { field: 'skillId', optional: true })
      .edges('comments', { ref: 'documentId' })
      .searchIndex('search_content', {
        searchField: 'content',
        filterFields: ['type', 'userId'],
      }),

    // --------------------
    // Skill, Resource & Related Models
    // --------------------
    skills: defineEnt({
      // Tree relationships
      tree: v.optional(v.any()), // JSON

      published: v.boolean(),
      title: v.string(),
      description: v.optional(v.string()),
      content: v.optional(v.string()),
      contentRich: v.optional(v.any()), // JSON
      difficulty: v.optional(v.number()),
      private: v.boolean(),
      deletedAt: v.optional(v.number()),
    })
      // LATER: Pure many:many edges - no fields needed!
      .edges('children', {
        to: 'skills',
        inverse: 'parents',
        table: 'skillChildren',
        field: 'parentSkillId',
        inverseField: 'childSkillId',
      })
      // .edges('rootedSkills', { to: 'skills', inverse: 'rootSkills' })
      // .edges('forkedTo', { to: 'skills', inverse: 'forkedFrom' })
      .field('rootSkillId', v.optional(v.id('skills')), { index: true })
      .field('parentSkillId', v.optional(v.id('skills')), { index: true })
      .field('forkedFromSkillId', v.optional(v.id('skills')), { index: true })
      // .edge('parent', { to: 'skills', field: 'parentSkillId', optional: true })
      // .edge('root', { to: 'skills', field: 'rootSkillId', optional: true })
      // .edge('forkedFrom', { to: 'skills', field: 'forkedFromSkillId', optional: true })
      .edge('user')
      .edges('characterSkills', { to: 'characterSkills', ref: 'skillId' })
      .edges('linkedTargets', {
        to: 'skills',
        table: 'skillLinks',
        field: 'sourceSkillId',
        inverseField: 'targetSkillId',
        inverse: 'linkedSources',
      })
      .edges('dependencies', {
        to: 'skills',
        inverse: 'dependents',
        table: 'skillDependencies',
        field: 'dependentSkillId',
        inverseField: 'dependencySkillId',
      })
      .edges('requiredResources', { ref: true })
      .edges('tags', {
        to: 'tags',
        table: 'skillTags',
        field: 'skillId',
        inverseField: 'tagId',
      })
      .edges('learningPaths', {
        to: 'learningPaths',
        table: 'learningPathSkills',
        field: 'skillId',
        inverseField: 'learningPathId',
      })
      .edges('documents', { ref: 'skillId' })
      .edges('notifications', { ref: 'skillId' })
      .edges('reports', { ref: 'skillId' })
      .edges('comments', { ref: 'skillId' })
      .edges('skillSettings', { ref: true })
      .edges('progress', { ref: 'skillId' })
      .edges('starredBy', {
        to: 'users',
        table: 'skillStars',
        field: 'userId',
      })
      .searchIndex('search_title_content', {
        searchField: 'title',
        filterFields: ['userId', 'published', 'private'],
      }),

    skillSettings: defineEnt({
      goal: v.string(),
      goalRich: v.optional(v.any()), // JSON
    })
      .edge('user')
      .edge('skill')
      .index('userId_skillId', ['userId', 'skillId']),

    resources: defineEnt({})
      .edge('comment')
      .edges('requiredResources', { ref: true })
      .edges('progress', { ref: 'resourceId' }),

    requiredResources: defineEnt({
      order: v.optional(v.string()),
    })
      .edge('skill')
      .edge('resource')
      .index('skillId_resourceId', ['skillId', 'resourceId']),

    progress: defineEnt({
      skillId: v.optional(v.id('skills')),
      resourceId: v.optional(v.id('resources')),
      manualCheck: v.boolean(),
      data: v.optional(v.any()), // JSON
      completedAt: v.optional(v.number()),
      level: v.optional(v.string()),
      timeSpent: v.optional(v.number()),
    })
      .edge('user')
      .edge('skill', { field: 'skillId', optional: true })
      .edge('resource', { field: 'resourceId', optional: true })
      .index('userId_skillId', ['userId', 'skillId'])
      .index('userId_resourceId', ['userId', 'resourceId']),

    tags: defineEnt({
      color: v.optional(v.string()),
    })
      .field('name', v.string(), { index: true })
      .edge('user')
      .edges('skills', {
        to: 'skills',
        table: 'skillTags',
        field: 'tagId',
        inverseField: 'skillId',
      })
      .index('userId_name', ['userId', 'name']),

    // --------------------
    // Comment Model (Polymorphic Attachment)
    // --------------------
    comments: defineEnt({
      skillId: v.optional(v.id('skills')),
      documentId: v.optional(v.id('documents')),

      content: v.string(),
      contentRich: v.any(), // JSON

      // Link preview
      url: v.optional(v.string()),
      urlTitle: v.optional(v.string()),
      urlImage: v.optional(v.string()),
      urlPublisher: v.optional(v.string()),
      urlDescription: v.optional(v.string()),
    })
      .edge('user')
      .edge('skill', { field: 'skillId', optional: true })
      .edge('document', { field: 'documentId', optional: true })
      .edges('resources', { ref: 'commentId' })
      .edges('upvotedBy', {
        to: 'users',
        table: 'commentUpvotes',
        field: 'userId',
      })
      .edges('notifications', { ref: 'commentId' })
      .edges('reports', { ref: 'commentId' })
      .searchIndex('search_content', {
        searchField: 'content',
        filterFields: ['userId', 'skillId'],
      }),

    // --------------------
    // Upvote, Dependency, and Report Models
    // --------------------
    learningPaths: defineEnt({
      flowData: v.optional(v.any()), // JSON
    })
      .edge('user')
      .edges('skills', {
        to: 'skills',
        table: 'learningPathSkills',
        field: 'learningPathId',
        inverseField: 'skillId',
      }),

    // --------------------
    // Notifications & Reports
    // --------------------
    notifications: defineEnt({
      type: notificationTypeEnum,
      commentId: v.optional(v.id('comments')),
      skillId: v.optional(v.id('skills')),
      projectId: v.optional(v.id('projects')),
      senderId: v.optional(v.id('users')),
      message: v.optional(v.string()),
      read: v.boolean(),
    })
      .edge('user')
      .edge('comment', { field: 'commentId', optional: true })
      .edge('skill', { field: 'skillId', optional: true })
      .edge('project', { to: 'projects', field: 'projectId', optional: true })
      .edge('sender', { to: 'users' })
      .index('userId_read', ['userId', 'read']),

    reports: defineEnt({
      reason: v.string(),
      feedback: v.optional(v.string()),
    })
      .field('reportStatus', reportStatusEnum, { index: true })
      .edge('reportedByUser', { to: 'users', field: 'reportedByUserId' })
      .edge('user', { field: 'userId', optional: true })
      .edge('character', { field: 'characterId', optional: true })
      .edge('skill', { field: 'skillId', optional: true })
      .edge('comment', { field: 'commentId', optional: true }),

    // --------------------
    // Development Settings (Dev Only)
    // --------------------
    devSettings: defineEnt({
      plan: v.string(),
      role: v.string(),
      wait: v.number(),
      waitAppLayout: v.number(),
      summary: v.optional(v.string()),
      credits: v.optional(v.number()),
      monthlyCredits: v.optional(v.number()),
      monthlyCreditsPeriodStart: v.optional(v.number()),
      monthlyCreditsPeriodCount: v.optional(v.number()),
      stripeCurrentPeriodStart: v.optional(v.number()),
      stripePriceId: v.optional(v.string()),
      stripeCurrentPeriodEnd: v.optional(v.number()),
    }).edge('user'),

    // --------------------
    // Join Tables with extended fields, indexes (two 1:many edges) and edges
    // --------------------
    messageVotes: defineEnt({})
      .field('isDownvoted', v.boolean())
      .edge('user')
      .edge('message')
      .index('userId_messageId', ['userId', 'messageId'])
      .index('messageId_userId', ['messageId', 'userId']),

    // --------------------
    // Join Tables mapping the auto-generated edges (needed only for TypeScript and aggregates).
    // NOT SUPPORTED: custom fields, indexes, edges.
    // --------------------
    follows: defineEnt({})
      .field('followerId', v.id('users'), { index: true })
      .field('followingId', v.id('users'), { index: true })
      .index('followerId_followingId', ['followerId', 'followingId'])
      .index('followingId_followerId', ['followingId', 'followerId']),
    projectStars: defineEnt({})
      .field('userId', v.id('users'), { index: true })
      .field('projectId', v.id('projects'), { index: true })
      .index('userId_projectId', ['userId', 'projectId'])
      .index('projectId_userId', ['projectId', 'userId']),
    characterStars: defineEnt({})
      .field('userId', v.id('users'), { index: true })
      .field('characterId', v.id('characters'), { index: true })
      .index('userId_characterId', ['userId', 'characterId'])
      .index('characterId_userId', ['characterId', 'userId']),
    commentUpvotes: defineEnt({})
      .field('userId', v.id('users'), { index: true })
      .field('commentId', v.id('comments'), { index: true })
      .index('userId_commentId', ['userId', 'commentId'])
      .index('commentId_userId', ['commentId', 'userId']),
    skillStars: defineEnt({})
      .field('userId', v.id('users'), { index: true })
      .field('skillId', v.id('skills'), { index: true })
      .index('userId_skillId', ['userId', 'skillId'])
      .index('skillId_userId', ['skillId', 'userId']),
    // skillChildren: defineEnt({})
    //   .edge('parent', { to: 'skills' })
    //   .edge('child', { to: 'skills' })
    //   .index('parentId_childId', ['parentId', 'childId'])
    //   .index('childId_parentId', ['childId', 'parentId']),
    // skillDependencies: defineEnt({})
    //   .edge('dependent', { to: 'skills' })
    //   .edge('dependency', { to: 'skills' })
    //   .index('dependentId_dependencyId', ['dependentId', 'dependencyId'])
    //   .index('dependencyId_dependentId', ['dependencyId', 'dependentId']),
    // skillLinks: defineEnt({})
    //   .edge('source', { to: 'skills' })
    //   .edge('target', { to: 'skills' })
    //   .index('sourceId_targetId', ['sourceId', 'targetId'])
    //   .index('targetId_sourceId', ['targetId', 'sourceId']),
    // skillTags: defineEnt({})
    //   .edge('skill')
    //   .edge('tag')
    //   .index('skillId_tagId', ['skillId', 'tagId'])
    //   .index('tagId_skillId', ['tagId', 'skillId']),
    // learningPathSkills: defineEnt({})
    //   .edge('learningPath')
    //   .edge('skill')
    //   .index('learningPathId_skillId', ['learningPathId', 'skillId'])
    //   .index('skillId_learningPathId', ['skillId', 'learningPathId']),
    // characterWorkSkills: defineEnt({})
    //   .edge('work', { to: 'characterWorks' })
    //   .edge('characterSkill', { to: 'characterSkills' })
    //   .index('workId_characterSkillId', ['workId', 'characterSkillId'])
    //   .index('characterSkillId_workId', ['characterSkillId', 'workId']),
    // characterEducationSkills: defineEnt({})
    //   .edge('education', { to: 'characterEducations' })
    //   .edge('characterSkill', { to: 'characterSkills' })
    //   .index('educationId_characterSkillId', ['educationId', 'characterSkillId'])
    //   .index('characterSkillId_educationId', ['characterSkillId', 'educationId']),
    // characterProjectSkills: defineEnt({})
    //   .edge('project', { to: 'characterProjects' })
    //   .edge('characterSkill', { to: 'characterSkills' })
    //   .index('projectId_characterSkillId', ['projectId', 'characterSkillId'])
    //   .index('characterSkillId_projectId', ['characterSkillId', 'projectId']),
    // characterCertificateSkills: defineEnt({})
    //   .edge('certificate', { to: 'characterCertificates' })
    //   .edge('characterSkill', { to: 'characterSkills' })
    //   .index('certificateId_characterSkillId', ['certificateId', 'characterSkillId'])
    //   .index('characterSkillId_certificateId', ['characterSkillId', 'certificateId']),

    projectCharacters: defineEnt({})
      .field('projectId', v.id('projects'), { index: true })
      .field('characterId', v.id('characters'), { index: true })
      .index('projectId_characterId', ['projectId', 'characterId'])
      .index('characterId_projectId', ['characterId', 'projectId']),
  },
  {
    schemaValidation: true,
  }
);

export default schema;

// Export ent definitions for use throughout the app
export const entDefinitions = getEntDefinitions(schema);
