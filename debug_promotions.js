
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role to bypass RLS for debugging if needed

if (!url || !anonKey) {
    console.error('Missing env vars');
    process.exit(1);
}

// Using service role to see EVERYTHING first
const supabase = createClient(url, serviceRoleKey || anonKey);

async function check() {
    console.log('Checking active promotions...');

    const { data: promotions, error } = await supabase
        .from('promotions')
        .select('*')

    if (error) {
        console.error('Error fetching promotions:', error);
    } else {
        console.log('All Promotions:', promotions);
        const active = promotions.filter(p => p.is_active);
        console.log('Active Promotions:', active);
    }
}

check();
