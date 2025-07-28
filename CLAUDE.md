# CLAUDE.md

## Project Overview

- Project Status: @.claude/docs/project-status.md
- App Design: @.claude/docs/app-design-document.md
- Tech Stack: @.claude/docs/tech-stack.md
- Project Structure: @.claude/docs/project-structure.md

## Rules

- .cursor/rules/convex.mdc - Convex backend development - **CRITICAL** you should absolutely read this file when working in convex folder (backend side)

- @.cursor/rules/react.mdc - React patterns
- @.cursor/rules/nextjs.mdc - Next.js patterns
- @.cursor/rules/global-css.mdc - CSS configuration
- @.cursor/rules/tailwind-v4.mdc - Tailwind v4 features
- @.cursor/rules/convex-client.mdc - Convex client utilities
- @.cursor/rules/modal-system.mdc - Modal implementation
- @.cursor/rules/toast.mdc - Notification patterns
- @.cursor/rules/jotai-x.mdc - State management patterns

Read only when needed:

- .cursor/rules/zustand-x.mdc - Zustand patterns
- .cursor/rules/hookstate.mdc - Hookstate patterns

## Development

### Commands

- `pnpm typecheck` - Run TypeScript type checking (must pass without errors) on each task end
- `pnpm lint:fix` - Run ESLint and fix linting errors on precommit (not on each task end)
- DO NOT run `pnpm dev` or `pnpm build` or `pnpm start` - these are manual commands.

### Agents

Specialized sub-agents are automatically picked by Claude. Each operates with its own context window and focused expertise.

**@ References Rule**: When using sub-agents with @ references in the prompt, the sub-agent MUST use the Read tool to read ALL @ referenced files before starting any task. Sub-agents cannot automatically access @ referenced content like the main context can.
