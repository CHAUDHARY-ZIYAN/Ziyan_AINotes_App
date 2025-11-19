// middleware.ts (root)
export { updateSession as middleware } from './src/lib/supabase/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
