# scripts/verify_rls.py
import os, sys, re

schema_path = os.path.join(os.path.dirname(__file__), '..', 'supabase', 'migrations', '20260928_spendwise_schema.sql')
if not os.path.exists(schema_path):
    print(f"[FAIL] Missing {schema_path}")
    sys.exit(1)

with open(schema_path, 'r', encoding='utf-8') as f:
    sql = f.read()

required_tables = [
    'users', 'expenses', 'expense_items', 'budgets', 'savings_goals',
    'subscriptions', 'bills', 'shared_groups', 'group_members',
    'group_expenses', 'group_splits', 'challenges'
]

print("Running Python RLS verification...")
errors = 0
for table in required_tables:
    if f"ALTER TABLE public.{table} ENABLE ROW LEVEL SECURITY;" not in sql:
        print(f"FAIL: Table {table} lacks RLS")
        errors += 1
    else:
        print(f"PASS: Table {table} has RLS enabled")

if errors == 0:
    print("ALL TABLES SECURED WITH RLS.")
    sys.exit(0)
else:
    sys.exit(1)
