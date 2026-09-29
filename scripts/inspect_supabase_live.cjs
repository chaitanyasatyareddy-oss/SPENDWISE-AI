const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ngqvqmhjooowoxlmwfun.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXZxbWhqb29vd294bG13ZnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODc2MjEsImV4cCI6MjEwNjE2MzYyMX0._bzwHFqScIGiUp2yULYzCsKcjeEqwaaerbvm_1Mu1es';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSupabase() {
  console.log('--- Checking Supabase tables ---');
  const resUsers = await supabase.from('users').select('id, full_name, email').limit(2);
  console.log('users table:', resUsers.error ? resUsers.error.message : resUsers.data);

  const resProfiles = await supabase.from('profiles').select('*').limit(2);
  console.log('profiles table:', resProfiles.error ? resProfiles.error.message : resProfiles.data);

  console.log('--- Checking Supabase Auth Providers ---');
  const resPhone = await supabase.auth.signInWithOtp({ phone: '+919063534530' });
  console.log('Phone OTP status:', resPhone.error ? `${resPhone.error.code} - ${resPhone.error.message}` : 'Phone OTP enabled!');
}

inspectSupabase();
