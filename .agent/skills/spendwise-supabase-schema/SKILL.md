---
name: spendwise-supabase-schema
description: Generates, applies, and verifies PostgreSQL database schemas, Row-Level Security (RLS) policies, and database functions for SpendWise AI on Supabase.
triggers:
  - database migration
  - supabase schema
  - RLS policies
  - spendwise database
---

# Mission Statement
Ensure all SpendWise AI database structures maintain strict multi-tenant isolation through Supabase Row-Level Security (RLS), store normalized transaction structures, and execute aggregation routines efficiently.

# Execution Guidelines
1. Always include `user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid()` on all user-owned tables.
2. Explicitly enable Row Level Security on every generated table: `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;`.
3. Generate standard CRUD RLS policies isolating records strictly to `auth.uid() = user_id`.
4. For `shared_groups` and `group_expenses`, enforce access via group membership security definer functions to prevent cross-tenant data leaks.
5. Create dynamic SQL indexes on high-frequency query paths: `(user_id, date DESC)` and `(user_id, category)`.

# Verification Requirements
- Execute script `scripts/verify_rls.js` (or `scripts/verify_rls.py`) to confirm no tables lack RLS policies.
- Verify foreign key constraints and check constraint validity for monetary amounts (`amount >= 0`).
