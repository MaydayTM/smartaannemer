# SmartAannemer

Lead finder for renovation projects in Belgium.

## Overview

SmartAannemer helps homeowners find qualified contractors for renovation projects (roof, facade, insulation, solar panels). Users get:
- AI-powered price estimates in 60 seconds
- Match with 1-3 verified contractors
- One free credit to use the tool

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel
- **Icons:** Lucide React

## Architecture

Feature-based modules with React Context for state management and Repository pattern for data access.

See [Design Document](./docs/plans/2025-01-18-smartaannemer-react-app-design.md) for complete architecture details.

## Project Structure

```
smartaannemer/
├── app/              # Next.js App Router
├── features/         # Feature modules (lead-finder, credits, etc.)
├── lib/              # Repositories, utilities, Supabase client
├── components/       # Shared UI components
├── types/            # TypeScript type definitions
├── design/           # Original HTML mockup
└── docs/             # Design documents and plans
```

## Getting Started

Coming soon - project setup in progress.

## Design Reference

Original mockup: [design/original-mockup.html](./design/original-mockup.html)

## License

Private project
