const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ngqvqmhjooowoxlmwfun.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXZxbWhqb29vd294bG13ZnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODc2MjEsImV4cCI6MjEwNjE2MzYyMX0._bzwHFqScIGiUp2yULYzCsKcjeEqwaaerbvm_1Mu1es';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testOtp() {
  console.log('Testing Supabase Phone OTP for +919063534530:');
  const res = await supabase.auth.signInWithOtp({
    phone: '+919063534530',
  });
  console.log('Result:', JSON.stringify(res, null, 2));
}

testOtp();
