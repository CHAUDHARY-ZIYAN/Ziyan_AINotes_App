//src/lib/supabase/client.ts
// src/lib/supabase/client.ts
// src/lib/supabase/client.ts
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// import type { Database } from '@/types/supabase';
// src/lib/supabase/client.ts
// import { createClient } from '@supabase/supabase-js'
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
// // ✅ Create and export a client-side Supabase client
// export const createClient = () => createClientComponentClient<Database>();


// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// import type { Database } from '@/types/supabase';

// export const createClient = () => {
//   return createClientComponentClient<Database>();
// };


// import { createClient } from '@supabase/supabase-js'
// const supabaseUrl = 'https://curzvsoozzlthbqbkeed.supabase.co'
// const supabaseKey = process.env.SUPABASE_KEY
// const supabase = createClient(supabaseUrl, supabaseKey)