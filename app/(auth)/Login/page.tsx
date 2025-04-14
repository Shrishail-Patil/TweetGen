'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SquiggleButton } from '@/app/components/squiggle-button';
import FloatingElements from '@/app/components/FloatingElements';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    console.log('[LOGIN] Initiating Google login');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('[LOGIN] Error during sign-in:', error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <FloatingElements />
      <motion.div className="glass-card p-8 rounded-2xl shadow-xl w-full max-w-md relative z-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <motion.button onClick={() => router.back()} className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
        </motion.button>
        <motion.h1 className="text-3xl font-bold text-center mb-6 text-gradient" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          Login to TweetGeni
        </motion.h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <SquiggleButton onClick={handleGoogleLogin} disabled={loading} className="px-6 py-3 mx-auto block">
            {loading ? 'Loading...' : 'Sign in with Google'}
          </SquiggleButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
