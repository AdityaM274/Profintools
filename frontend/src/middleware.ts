import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
    // Update session for Supabase Auth
    const response = await updateSession(request)

    const path = request.nextUrl.pathname
    const ip = request.headers.get('x-forwarded-for') || 'unknown'

    // 1. Block access to /admin (HONEYPOT)
    // We return 404 to confuse potential attackers scanning for /admin
    if (path.startsWith('/admin')) {
        // Ideally log this attempt to Supabase via service role (if we had access here)
        // For now, just hard 404
        console.warn(`[SECURITY] Suspicious access to /admin from ${ip}`)
        return NextResponse.rewrite(new URL('/404', request.url)) // Assuming you have a custom 404 page or Next.js default
    }

    // 2. Protect Real Admin Path: /sys-admin-control-v1
    if (path.startsWith('/sys-admin-control-v1')) {
        // Initialize Supabase Client to check auth
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: { headers: { Authorization: request.headers.get('Authorization')! } },
                cookies: { get(n) { return request.cookies.get(n)?.value } }
            }
        )
        const { data: { user } } = await supabase.auth.getUser()

        // Strict Admin Verification
        let isAdmin = false;

        if (user) {
            // 1. Check specific email (Hardcoded for immediate safety)
            // Added explicit whitelist to ensure you can get in regardless of DB state for now.
            const allowedAdmins = ['admin@test.com', 'superadmin@gmail.com'];
            const isEmailMatch = allowedAdmins.includes(user.email || '');

            // 2. Check Database Role (Requires user to have run schema migration)
            let isRoleMatch = false;
            try {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                isRoleMatch = profile?.role === 'admin';
            } catch (e) {
                // Ignore error, rely on email match if DB fail
            }

            // Admin if Email matches OR Role is 'admin'
            isAdmin = isEmailMatch || isRoleMatch;
        }

        if (!user || !isAdmin) {
            console.warn(`[SECURITY] Unauthorized access to admin panel from ${ip} (User: ${user?.email || 'Guest'})`)
            return NextResponse.rewrite(new URL('/404', request.url)) // 404 to hide existence
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
