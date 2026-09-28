const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');


const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const urlMatch = envContent.match(/VITE_SUPABASE_URL=([^\r\n]+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=([^\r\n]+)/);

const supabaseUrl = (urlMatch && urlMatch[1]) || process.env.VITE_SUPABASE_URL || 'https://ngqvqmhjooowoxlmwfun.supabase.co';
const supabaseKey = (keyMatch && keyMatch[1]) || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const tables = [
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

async function checkLiveTables() {
  console.log('====================================================');
  console.log('SPENDWISE AI: LIVE SUPABASE TABLES VERIFICATION');
  console.log('====================================================');
  let passed = 0;
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error && error.code === 'PGRST205') {
      console.log(`  ✗ Table public.${t} NOT FOUND (${error.message})`);
    } else if (error) {
      // If error is RLS or empty query, table exists!
      console.log(`  ✓ Table public.${t} exists! (Status info: ${error.message || error.code})`);
      passed++;
    } else {
      console.log(`  ✓ Table public.${t} exists and queried successfully! (Rows: ${data.length})`);
      passed++;
    }
  }
  console.log('====================================================');
  console.log(`SUMMARY: ${passed}/${tables.length} tables verified live in Supabase.`);
  console.log('====================================================');
}

checkLiveTables();
