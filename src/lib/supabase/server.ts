// src/lib/supabase/server.ts
// src/lib/supabase/server.ts
// src/lib/supabase/client.ts
// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';
// import type { Database } from '@/types/supabase';

// export function createServerClient() {
//   return createServerComponentClient<Database>({ cookies });
// }
// src/lib/supabase/server.ts
import { createServerClient as createSSRClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

export const createServerClient = () => {
  const cookieStore = cookies();

  return createSSRClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component, ignore
          }
        },
      },
    }
  );
};



// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';
// import type { Database } from '@/types/supabase';

// export const createServerClient = () => {
//   const cookieStore = cookies();
//   return createServerComponentClient<Database>({ cookies: () => cookieStore });
// };