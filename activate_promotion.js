
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(url, serviceRoleKey);

async function activate() {
    console.log('Activating first promotion...');

    // Get first promo id
    const { data: promos } = await supabase.from('promotions').select('id').limit(1);

    if (promos && promos.length > 0) {
        const id = promos[0].id;
        console.log(`Activating promotion ${id}`);

        const { error } = await supabase
            .from('promotions')
            .update({ is_active: true })
            .eq('id', id);

        if (error) console.error('Error activating:', error);
        else console.log('Success! Promotion activated.');
    } else {
        console.log('No promotions found.');
    }
}

activate();
