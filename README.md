# Simultan

Simultan is an open-source **content scheduling and crossposting engine** built for developers who hate marketing tools. No drag-and-drop calendars, no "AI magic," no fluff. Just a markdown editor and a deploy button for your social presence.

## ⚡ Features

- **Brutalist "Dev-Native" UI:** A terminal-inspired interface using the **Lyra** preset from Shadcn/UI.
- **Markdown First:** Write posts like you write code. Full syntax highlighting and preview.
- **"Deploy" Your Content:** Treat social posts like commits. Stage them, schedule them, and push to production.
- **Simultaneous Scheduling:** Post to multiple platforms at the exact same second using **Convex Scheduled Functions**.
- **Privacy Focused:** Self-hostable. Your API keys stay in your database, not ours.

## 🔌 Supported Integrations

- **Bluesky** (Native AT Protocol)
- **LinkedIn** (OAuth 2.0)
- **Dev.to / Hashnode** (For long-form devlogs)
- **Mastodon** (ActivityPub)
- *(Coming Soon)* Twitter/X & Threads

## 🛠️ The Stack

Built on the bleeding edge for maximum performance and type safety.

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router + React Compiler)
- **Backend & Database:** [Convex](https://convex.dev/) (Real-time + Built-in Scheduler)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Auth:** [Clerk](https://clerk.com/) or GitHub OAuth
- **Type Safety:** TypeScript + Biome