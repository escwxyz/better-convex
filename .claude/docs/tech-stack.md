# Tech Stack Documentation

## Overview

Evergarden is a modern web-based Character AI Chat Platform built with a comprehensive Next.js stack. The application leverages cutting-edge technologies for real-time AI interactions, character profile management, and social features. The architecture uses Convex as a complete backend solution, providing real-time database, type-safe APIs, and serverless functions in a unified platform.

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript with strict type safety
- **Backend:** Convex - Complete backend platform with real-time database
- **API:** Convex functions for type-safe server-side logic, Hono for streaming endpoints
- **Deployment:** Optimized for Vercel deployment
- **Architecture:** Full-stack with unified backend via Convex

## Programming Language & Runtime

- **TypeScript**: Primary language throughout the application with strict type checking
  - Strict mode enabled in `tsconfig.json`
  - Type-safe API contracts via Convex
  - Zod schemas for runtime validation
  - Full type coverage for database models via Convex schema
- **Node.js**: Runtime environment (version requirements in `.nvmrc`)
- **pnpm**: Package manager with workspace support (v9.9.0)

## Frontend

### UI Framework & Libraries

- **React 19**: Latest React version with server components and concurrent features

  - Server Components in App Router (`src/app/**/*.tsx`)
  - Client Components with `"use client"` directive
  - Concurrent rendering and Suspense boundaries
  - React Hook Form for form management with Zod validation

- **Next.js 15**: Full-stack React framework with App Router
  - App Router with parallel routes (`@header`)
  - Dynamic layouts and nested routing
  - Server-side rendering and static generation
  - API routes with route handlers
  - Promise-based params and searchParams
  - Middleware for authentication and redirects
  - Turbopack support for faster builds

### Styling & Design System

- **Tailwind CSS v4**: Modern utility-first CSS framework

  - CSS-first configuration with `@theme` directive
  - Custom breakpoints: `@xl` (640px), `@3xl` (1024px), `@5xl` (1280px)
  - Container queries support (`@container`, `@sm:`, `@md:`)
  - 3D transforms and modern CSS features
  - CSS variables for theming in `globals.css`

- **shadcn/ui**: Comprehensive component library

  - 50+ pre-built components in `src/components/ui/`
  - Radix UI primitives for accessibility
  - Consistent theming with CSS variables
  - Components: Button, Card, Dialog, Form, Table, etc.
  - Custom components like DataTable, CommandMenu

- **Animation & Interactions**:
  - **Framer Motion**: Smooth animations and gestures
  - **Embla Carousel**: Touch-friendly carousel with autoplay
  - **Vaul**: Drawer components for mobile-first interfaces

### State Management

- **Jotai**: Atomic state management with type-safe stores

  - `createAtomStore` pattern for global state
  - `atomWithCookie` for persistent state
  - Scoped providers for component isolation
  - Used in chat system and app-wide state

- **Convex React Query**: Server state management

  - Integration with Convex for real-time queries via `@convex-dev/react-query`
  - Custom hooks: `usePublicQuery`, `useAuthQuery`, `usePublicMutation`, `useAuthMutation`
  - Optimistic updates and cache invalidation
  - Live query subscriptions with automatic deduplication
  - Paginated queries with `usePublicPaginatedQuery` and `useAuthPaginatedQuery`
  - Automatic reactivity

- **nuqs**: URL state management
  - Type-safe query parameters
  - History mode configuration
  - Custom parsers for different data types
  - Centralized hooks in `useQueryState.ts`

### Rich Text Editing

- **Plate Editor**: Extensible rich text editor (v49.0.4)
  - Plugin-based architecture
  - Markdown support
  - Code blocks with syntax highlighting
  - Mentions and hashtags
  - AI integration
  - Custom toolbar components

### Component Architecture

- **Modal System**: Centralized modal management

  - `createPushModal` for type-safe modals
  - Dialog, AlertDialog, and DialogFull wrappers
  - Stack-based modal navigation
  - Consistent state management

- **Command Palette (CMDK)**: Keyboard navigation
  - Global command menu with search
  - Context-aware actions
  - Keyboard shortcuts
  - AI integration for smart commands

### Additional UI Libraries

- **Lucide React**: Modern icon library with 1000+ icons
- **Sonner**: Toast notifications with promise support
- **React Dropzone**: Drag-and-drop file uploads
- **Next Themes**: Dark mode with system preference detection
- **Recharts**: Data visualization for analytics

## Backend

### Backend Platform

- **Convex**: Complete backend solution

  - Real-time database with automatic reactivity
  - Type-safe server functions (queries, mutations, actions)
  - Built-in authentication with Better-Auth integration
  - HTTP endpoints for webhooks and external integrations
  - Scheduled functions and cron jobs
  - WebSocket support for real-time features
  - Automatic scaling and zero-config deployment

- **Convex Ents**: Enhanced entity framework (v0.15.0)
  - Relationship management with edges
  - Type-safe schema definition
  - Automatic query optimization
  - Built-in validation
  - Soft deletion support
  - Virtual fields and computed properties

### API Framework

- **Convex Functions**: Type-safe server-side logic

  - Query functions for read operations in `convex/`
  - Mutation functions for write operations
  - Action functions for external API calls
  - HTTP endpoints for webhooks and external integrations
  - Automatic TypeScript code generation with `_generated/api.d.ts`
  - Real-time subscriptions out of the box
  - Custom server utilities: `fetchAuthQuery`, `fetchAuthMutation` for RSC

- **Hono**: Lightweight web framework for streaming endpoints
  - AI streaming routes in `src/server/hono/`
  - File upload/download handling
  - Middleware for auth and rate limiting
  - Edge runtime compatible

### Database & Schema

- **Convex Database**: Serverless, real-time database

  - Document-based with ACID transactions
  - Automatic indexing and query optimization
  - Real-time subscriptions with reactive queries
  - Schema defined in `convex/schema.ts`
  - Type-safe queries with automatic TypeScript types
  - Built-in full-text search

- **Convex Ents Schema**: Enhanced schema management
  - Declarative relationships
  - Unique constraints
  - Indexed fields
  - Virtual fields and computed properties

### Validation & Security

- **Zod**: Runtime type validation

  - Input validation for all Convex functions
  - Form validation schemas
  - Environment variable validation
  - Custom validators and refinements
  - Error message customization

- **Convex Security**:
  - Built-in authentication checks with `requireAuth`, `requireAdmin`, `requirePremium`
  - Row-level security with Convex Rules
  - Rate limiting via custom `rateLimiter.ts` using Convex storage (not Upstash)
  - Role-based guards in `convex/helpers/roleGuard.ts`
  - Automatic HTTPS and encryption at rest

### Email & Communication

- **Resend**: Modern email API
  - Transactional emails
  - React email templates
  - Delivery tracking
  - Domain verification

## Database & Storage

### Primary Database

- **Convex Database**: Main data store
  - Document database with relational capabilities
  - ACID transactions
  - Automatic backups
  - Point-in-time recovery
  - Global distribution

### Caching & Rate Limiting

- **Redis (Upstash)**: Serverless Redis for additional caching

  - Rate limiting with sliding windows
  - Session storage (when needed beyond Convex)
  - Cache invalidation patterns
  - Pub/sub for real-time features

- **Convex Built-in Caching**:
  - Automatic query result caching
  - Optimistic updates
  - Real-time invalidation

### Vector Database

- **Pinecone**: Vector search for AI features
  - Character embeddings
  - Semantic search
  - Similarity matching
  - LangChain integration

### File Storage

- **Cloudflare R2**: Primary S3-compatible object storage
  - Character avatars and documents
  - Presigned URLs for secure uploads
  - Public bucket for CDN delivery
  - Cost-effective egress pricing
  - Integration via `convex/helpers/s3.ts`

## AI Integration

### AI Models & Providers

- **OpenAI**: Primary AI provider

  - GPT-4o: Advanced reasoning and context understanding
  - GPT-4o-mini: Fast responses for simple queries
  - Function calling for tool use
  - Streaming responses

- **Google Gemini**: Alternative AI provider
  - Gemini 2.0: Latest model with enhanced capabilities
  - Gemini 2.0 Flash: Low-latency responses
  - Multimodal support (text + images)

### AI Frameworks

- **Vercel AI SDK**: Unified AI interface

  - Provider abstraction (OpenAI, Google, Anthropic)
  - Streaming with backpressure
  - Tool calling and function execution
  - Data stream handling
  - React hooks for AI state

- **LangChain**: AI application framework
  - Document processing and chunking
  - Embedding generation
  - Vector store integration
  - Chain composition
  - Memory management

### AI Features

- **Multimodal Input**: Rich media support

  - Image uploads and processing
  - File attachments in conversations
  - Preview generation
  - Drag-and-drop interface

- **AI Tools System**: Extensible function calling

  - Character data retrieval tool
  - Weather information tool
  - Character comparison tool
  - Save character tool
  - Custom tool plugins
  - Tool error boundaries

- **Streaming Architecture**:

  - Real-time token streaming
  - Artifact generation
  - Progress indicators
  - Stream interruption handling
  - Parallel tool execution

- **Prompt Engineering**:
  - Context-aware prompts in `prompts.ts`
  - Character personality injection
  - Conversation history management
  - Token optimization
  - Safety guidelines

## Authentication & Authorization

### Authentication Framework

- **Better-Auth**: Modern authentication solution
  - Convex adapter for seamless integration
  - Database storage via Convex
  - Session-based authentication
  - CSRF protection
  - Secure cookie handling
  - Type-safe client and server APIs

### OAuth Providers

- **Google OAuth**: Primary social login

  - Profile data mapping
  - Email verification
  - Avatar URL extraction

- **GitHub OAuth**: Developer-friendly login
  - Username mapping
  - Public profile data
  - Repository access (optional)

### Session Management

- **Server-side sessions**: Secure session handling
  - Convex-backed sessions
  - Automatic renewal
  - Session invalidation
  - Device management

### Authorization

- **Role-based access control**:

  - User roles: `USER`, `ADMIN`, `SUPERADMIN`
  - Convex function guards
  - API endpoint authorization
  - UI component visibility

- **Auth Guards & Helpers**:
  - Authentication checks in Convex functions
  - Server-side: `getSessionToken`, `isAuth`, `isUnauth` from `src/lib/convex/server.ts`
  - React hooks: `useIsAuth`, `useAuthGuard` from custom convex-hooks
  - RSC guards: `AuthGuard`, `UnauthGuard` components
  - Function-level: `requireAuth`, `requireAdmin`, `requirePremium`
  - Client-side protection with automatic login modal

## External Integrations

### Storage Services

- **Cloudflare R2**: Object storage solution
  - S3-compatible API via AWS SDK
  - Presigned URLs for secure uploads
  - Public bucket for CDN delivery
  - Cost-effective egress pricing
  - Bucket structure: `/avatars`, `/documents`, `/exports`

### Payment Processing

- **Stripe**: Complete payment infrastructure

  - Subscription management
  - One-time credit purchases
  - Customer portal integration
  - Webhook handling via Convex HTTP endpoints
  - Test mode for development
  - Price tiers in `plans.ts`

- **Stripe CLI**: Development tooling
  - Webhook forwarding
  - Event testing
  - Local development setup

## Quality Assurance & Testing

### Testing Framework

- **Vitest**: Modern testing framework
  - Unit tests for utilities and hooks
  - Integration tests for Convex functions
  - Component testing setup
  - Coverage reporting
  - Watch mode for development

### Code Quality

- **TypeScript**: Strict type checking

  - `strict: true` in tsconfig
  - No implicit any
  - Strict null checks
  - Type inference optimization

- **ESLint**: Code linting

  - Next.js recommended rules
  - TypeScript integration
  - Import sorting
  - Accessibility checks
  - Custom rule configurations

- **Prettier**: Code formatting
  - Consistent code style
  - Format on save
  - Integration with ESLint
  - Markdown formatting

### Pre-commit Hooks

- **Husky**: Git hooks management
- **lint-staged**: Run linters on staged files
- Type checking before commits
- Automatic formatting

## Development Tools & Workflow

### Package Management

- **pnpm**: Fast, disk space efficient package manager
  - Workspace support for monorepo structure
  - Strict dependency resolution
  - Lock file for reproducible builds
  - Scripts organization in package.json

### Build Tools

- **Next.js Build System**: Optimized production builds

  - Automatic code splitting
  - Image optimization
  - Font optimization
  - Bundle analysis with `@next/bundle-analyzer`
  - Turbopack support

- **TypeScript Compiler**: Type checking and transpilation
  - Incremental compilation
  - Project references
  - Path aliases configuration

### Development Experience

- **Hot Module Replacement**: Fast refresh in development
- **Error Overlay**: Detailed error messages
- **TypeScript Language Service**: IDE integration
- **Convex Dev Dashboard**: Real-time data inspection

## Deployment & Infrastructure

### Hosting Platform

- **Vercel**: Optimized Next.js hosting

  - Automatic deployments from Git
  - Preview deployments for PRs
  - Edge functions support
  - Analytics and Web Vitals
  - Environment variable management
  - Custom domains with SSL

- **Convex**: Backend hosting
  - Automatic deployment with `convex deploy`
  - Zero-downtime deployments
  - Automatic scaling
  - Global distribution

### CI/CD Pipeline

- **GitHub Actions**: Automated workflows
  - Type checking on PRs
  - Linting and formatting checks
  - Build verification
  - Automated dependency updates

### Infrastructure as Code

- **Docker**: Container support
  - Multi-stage Dockerfile
  - Development containers
  - Production optimization
  - Docker Compose for local services

### Security

- **Security Headers**: Protection against common attacks

  - CSP (Content Security Policy)
  - HSTS (HTTP Strict Transport Security)
  - X-Frame-Options
  - X-Content-Type-Options

- **Environment Security**:
  - Secret management with Vercel
  - Convex environment variables
  - API key rotation support

### Analytics & Monitoring

- **Vercel Analytics**: Performance monitoring

  - Core Web Vitals tracking
  - Real user monitoring
  - Custom events

- **Sentry Integration**: Error tracking
  - Source map support
  - User context
  - Performance monitoring

### Additional Services

- **Domain & DNS**: Managed through Vercel
- **SSL/TLS**: Automatic HTTPS with Let's Encrypt
- **CDN**: Global edge network via Vercel and Convex
- **Email Delivery**: Resend for transactional emails

## Additional Utilities

### Date & Time

- **date-fns**: Modern date utility library
  - Tree-shakeable functions
  - Timezone support
  - Locale support
  - Format parsing

### Data Processing

- **lodash**: Utility functions (selectively imported)
- **immer**: Immutable state updates
- **superjson**: Enhanced JSON serialization
  - Date/RegExp support
  - Circular reference handling
  - Type preservation

### Validation & Sanitization

- **validator**: String validation utilities
- **@coffeeandfun/google-profanity-words**: Content moderation

### UI Utilities

- **class-variance-authority (CVA)**: Component variants
- **@udecode/cn**: Class name utilities
- **tailwind-merge**: Integrated via cn utility

### Identifiers

- **nanoid**: URL-safe unique ID generation
- **canihazusername**: Human-readable username generation

## SEO & Metadata

- **Next.js Metadata API**: SEO optimization

  - Dynamic meta tags
  - Open Graph tags
  - Twitter cards
  - Canonical URLs

- **Vercel OG**: Dynamic social images

  - React-based OG image generation
  - Custom fonts and styling
  - Dynamic content injection

- **Sitemap Generation**: Automatic sitemap.xml
- **Robots.txt**: Search engine directives
- **Security Headers**: SEO-friendly security

## Commands Reference

### Development

- `pnpm dev` - Start development with Convex backend and Next.js (port 3000)
- `pnpm dev:app` - Start only Next.js development server
- `pnpm dev:backend` - Start only Convex development
- `pnpm build` - Build for production with Turbopack
- `pnpm start` - Start production server
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix and Prettier
- `pnpm check` - Run lint and typecheck concurrently

### Backend & Database

- `pnpm predev` - Initialize Convex (runs automatically before dev)
- `pnpm studio` - Open Convex dashboard
- `pnpm reset` - Reset all Convex tables
- `pnpm reset:auth` - Reset only auth data
- `pnpm seed` - Seed Convex database with sample data
- `pnpm dev:init` - Sync Convex environment variables
- `pnpm dev:sync` - Force sync Convex environment variables

### Testing

- `pnpm test` - Run test suite with Vitest
- `pnpm coverage` - Generate coverage report

### Analysis

- `pnpm analyze` - Analyze bundle size
- `pnpm build:stats` - Build with bundle analysis

### Stripe Integration

- `pnpm stripe:login` - Login to Stripe CLI
- `pnpm stripe:listen` - Forward webhooks to local Convex

## Environment Configuration

### Required Environment Variables

```bash
# Convex
CONVEX_DEPLOYMENT="..."
NEXT_PUBLIC_CONVEX_URL="..."

# Authentication
BETTER_AUTH_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

# AI Providers
OPENAI_API_KEY="..."
GOOGLE_GENERATIVE_AI_API_KEY="..."

# Storage (Additional)
CLOUDFLARE_ACCOUNT_ID="..."
CLOUDFLARE_ACCESS_KEY_ID="..."
CLOUDFLARE_SECRET_ACCESS_KEY="..."
NEXT_PUBLIC_R2_PUBLIC_URL="..."

# Payments
STRIPE_API_KEY="..."
STRIPE_WEBHOOK_SECRET="..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="..."

# Email
RESEND_API_KEY="..."

# Redis (Optional)
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."

# Vector Database
PINECONE_API_KEY="..."
PINECONE_ENVIRONMENT="..."
```

## Database Schema Overview

The Convex schema is defined using Convex Ents in `convex/schema.ts` with the following features:

- **Type-safe schema definition** with `defineEntSchema` and `defineEnt`
- **Declarative edges** for relationships between tables
- **Unique constraints** and **indexes** for performance
- **Search indexes** for full-text search
- **Default values** and **optional fields**

### Core Tables

- **users**: User accounts with auth, profile, and subscription data
  - Edges to: purchases, characters, chats, messages, notifications, etc.
  - Unique: email, username
  - Search index on username/name
- **characters**: AI character profiles with comprehensive CV data
  - Edges to: skills, works, educations, certificates, projects, etc.
  - Indexes for filtering by privacy and categories
  - Search index on character name
- **chats**: Conversation containers with character associations
  - Custom ID support for stable references
  - Indexes for efficient user/character queries
- **messages**: Individual messages with branching support
  - Parent/branch relationship for conversation trees
  - Custom ID field for stable references
  - Edges to votes

### Character Profile Tables

- **characterSkills**: Skills and interests with proficiency levels
- **characterWorks**: Professional experience
- **characterEducations**: Educational background
- **characterCertificates**: Professional certifications
- **characterProjects**: Portfolio projects
- **characterPublications**: Published works
- **characterAwards**: Achievements and recognition
- **characterReferences**: Professional references
- **characterFiles**: Attached documents

### Social & Engagement Tables

- **userFollows**: Following relationships
- **characterStars**: Favorite characters
- **comments**: User comments on content
- **notifications**: User notifications
- **reports**: Content moderation

### System Tables

- **categorySkills**: Admin-managed skill categories
- **tags**: Content categorization
- **documents**: Centralized rich content with type enum (SKILL, RESOURCE, CHAT, OTHER)
- **devSettings**: Development configuration for testing different user states
- **projects**: Folder-like organization for chats with member management
- **projectMembers**: Project membership with invitation tracking

## Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component with lazy loading
- **Font Optimization**: Next.js font optimization
- **Real-time Updates**: Convex reactive queries
- **Automatic Caching**: Convex query result caching
- **Static Generation**: Pre-rendered marketing pages
- **Edge Runtime**: Compatible with edge deployment

## Security Measures

- **Authentication**: Session-based with secure cookies via Better-Auth
- **Authorization**: Function-level access control in Convex
- **Input Validation**: Zod schemas on all inputs
- **Query Security**: Convex automatic parameterization
- **XSS Protection**: React's built-in protections + CSP
- **CSRF Protection**: Token-based protection
- **Rate Limiting**: Built-in Convex rate limiting
- **File Upload Security**: Type validation, size limits

## Development Workflow

### Git Workflow

- Feature branches with PR reviews
- Conventional commits
- Automated checks on PRs
- Protected main branch

### Code Standards

- TypeScript strict mode
- ESLint + Prettier enforcement
- Pre-commit hooks with Husky
- Component and API documentation

### Testing Strategy

- Unit tests for utilities
- Integration tests for Convex functions
- Component testing setup
- E2E testing ready (Playwright compatible)

## Future Considerations

### Planned Enhancements

- WebSocket expansion for more real-time features
- Advanced caching strategies
- Internationalization (i18n)
- Progressive Web App (PWA) features
- Advanced analytics integration

### Scalability Preparations

- Convex automatic scaling
- Global data distribution
- CDN-ready static assets
- Microservice extraction paths
