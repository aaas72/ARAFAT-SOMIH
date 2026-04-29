const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    env[key.trim()] = valueParts.join('=').trim().replace(/['"]/g, '');
  }
});

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY
);

async function checkAndAddFacebook() {
  console.log('Checking for social_facebook in site_content...');
  const { data } = await supabase
    .from('site_content')
    .select('*')
    .eq('section', 'social_facebook');

  if (data && data.length > 0) {
    console.log('social_facebook already exists in DB.');
  } else {
    console.log('social_facebook missing. Adding it...');
    const { error } = await supabase
      .from('site_content')
      .insert([
        { 
          page: 'common', 
          section: 'social_facebook', 
          content_ar: 'https://facebook.com/', 
          content_en: 'https://facebook.com/' 
        }
      ]);
    if (error) console.error('Error adding facebook:', error);
    else console.log('Successfully added social_facebook to DB.');
  }
}

checkAndAddFacebook();
