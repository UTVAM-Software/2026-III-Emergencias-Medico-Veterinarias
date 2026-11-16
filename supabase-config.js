import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://aeuadsmunxymrztfaqk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_iqVddk5ycG5HW6KnMU4w2a_xzQqSE3G';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);