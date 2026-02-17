
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(url, anonKey);

async function check() {
    const id = '83d505ba-2a29-4060-a74b-ee0504bde250';
    console.log(`Checking product ${id} with Anon Key...`);

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id);

    if (error) {
        console.error('Error fetching product:', error);
    } else {
        console.log('Product found:', data);
    }

    console.log('Listing recent products...');
    const { data: recent, error: listError } = await supabase
        .from('products')
        .select('id, name')
        .limit(5);

    if (listError) console.error(listError);
    else console.log('Recent products:', recent);
}

check();
