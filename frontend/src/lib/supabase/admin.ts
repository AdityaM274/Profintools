import { createClient } from '@supabase/supabase-js'

// Need to use service role key to update user profiles securely from server
export const createAdminClient = () =>
    createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // You need to add this to .env
    )
