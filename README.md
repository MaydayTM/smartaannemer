This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment Setup

1. Copy `.env.local.example` to `.env.local`
2. Fill in Supabase credentials (see setup instructions below)

### Supabase Configuration

To get your Supabase credentials:

1. Visit [Supabase](https://supabase.com) and create a new project
2. Go to Settings > API to find:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your public anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (keep this secret, never commit it)
3. Add these values to `.env.local`

The `NEXT_PUBLIC_APP_URL` is used for redirects and should point to your app's URL (default: http://localhost:3000 for development).

## Database Setup

To set up the database locally:

1. Install Supabase CLI: `brew install supabase/tap/supabase`
2. Start local Supabase: `npx supabase start`
3. Apply migrations: `npx supabase db push`
4. Get local credentials: `npx supabase status`

### Seed Demo Data

To populate the database with demo contractor data:

```bash
# Option 1: Reset database and apply seed (recommended for local development)
npx supabase db reset

# Option 2: Apply seed data to existing database
psql $DATABASE_URL < supabase/seed.sql
```

The seed data includes 3 verified contractors:
- **Dak & Gevel BV** (Antwerpen) - Roof and facade specialist with solar
- **Isolatie+ Collectief** (Leuven) - Insulation specialist collective
- **RenovaPro** (Gent) - Full-service renovation with all capabilities

All contractors are marked as verified, financially healthy, and eligible for guidance on renovation premiums.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
