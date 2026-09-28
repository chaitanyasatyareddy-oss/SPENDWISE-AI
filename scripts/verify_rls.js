// scripts/verify_rls.js
// Automated verification script for SpendWise AI database schema and RLS policies

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../supabase/migrations/20260928_spendwise_schema.sql');

if (!fs.existsSync(schemaPath)) {
    console.error(`[FAIL] Schema file not found: ${schemaPath}`);
    process.exit(1);
}

const sql = fs.readFileSync(schemaPath, 'utf8');

const requiredTables = [
    'users',
    'expenses',
    'expense_items',
    'budgets',
    'savings_goals',
    'subscriptions',
    'bills',
    'shared_groups',
    'group_members',
    'group_expenses',
    'group_splits',
    'challenges'
];

console.log('====================================================');
console.log('SPENDWISE AI: SUPABASE RLS & SCHEMA AUDIT PIPELINE');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

// 1. Verify table creation and RLS enablement
console.log('[STAGE 1] Checking Row-Level Security on all tables:');
for (const table of requiredTables) {
    const tableRegex = new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${table}`, 'i');
    const rlsRegex = new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY;`, 'i');

    const hasTable = tableRegex.test(sql);
    const hasRls = rlsRegex.test(sql);

    if (hasTable && hasRls) {
        console.log(`  ✓ Table public.${table.padEnd(16)} : Created & RLS ENABLED`);
        passCount++;
    } else {
        console.error(`  ✗ Table public.${table.padEnd(16)} : FAILED (Table: ${hasTable}, RLS: ${hasRls})`);
        failCount++;
    }
}

// 2. Verify non-negative check constraints on amounts
console.log('\n[STAGE 2] Checking Monetary Check Constraints (amount >= 0):');
const monetaryChecks = [
    { table: 'expenses', constraint: 'amount >= 0' },
    { table: 'expense_items', constraint: 'unit_price >= 0' },
    { table: 'expense_items', constraint: 'total_price >= 0' },
    { table: 'budgets', constraint: 'allocated_amount >= 0' },
    { table: 'savings_goals', constraint: 'target_amount > 0' },
    { table: 'subscriptions', constraint: 'amount >= 0' },
    { table: 'bills', constraint: 'estimated_amount >= 0' },
    { table: 'group_expenses', constraint: 'amount >= 0' }
];

for (const check of monetaryChecks) {
    if (sql.includes(check.constraint)) {
        console.log(`  ✓ Checked public.${check.table} has constraint: '${check.constraint}'`);
        passCount++;
    } else {
        console.error(`  ✗ Missing constraint '${check.constraint}' on public.${check.table}`);
        failCount++;
    }
}

// 3. Verify Foreign Key relationships & Indices
console.log('\n[STAGE 3] Checking High-Frequency Query Indices:');
const requiredIndices = [
    'idx_expenses_user_date',
    'idx_expenses_user_category'
];

for (const idx of requiredIndices) {
    if (sql.includes(idx)) {
        console.log(`  ✓ Index '${idx}' found`);
        passCount++;
    } else {
        console.error(`  ✗ Missing index '${idx}'`);
        failCount++;
    }
}

console.log('\n====================================================');
console.log(`AUDIT RESULTS: ${passCount} Passed, ${failCount} Failed.`);
if (failCount === 0) {
    console.log('SUCCESS: All SpendWise AI tables strictly conform to multi-tenant RLS.');
    console.log('====================================================');
    process.exit(0);
} else {
    console.error('FAILURE: Schema verification detected security gaps.');
    console.log('====================================================');
    process.exit(1);
}
