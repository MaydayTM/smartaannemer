#!/bin/bash
npx supabase gen types typescript --local > types/database.types.ts
echo "✓ Database types generated"
