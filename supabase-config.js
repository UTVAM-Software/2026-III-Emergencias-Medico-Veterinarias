import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://aeuadsmdunxymrztfaqk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_iqVddk5ycG5HW6KnMU4w2A_xzQqSE3G';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);