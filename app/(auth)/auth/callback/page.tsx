'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('[CALLBACK] Error retrieving session:', error.message);
        router.replace('/login');
        return;
      }

      if (data.session) {
        console.log('[CALLBACK] Session retrieved:', data.session);
        router.replace('/Home');
      } else {
        console.log('[CALLBACK] No session found');
        router.replace('/Login');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Processing authentication...</p>
    </div>
  );
}
