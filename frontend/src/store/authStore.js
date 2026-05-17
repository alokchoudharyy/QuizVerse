import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,

  initializeAuth: async () => {
    // Check active session on load
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user || null, loading: false });

    // Listen for auth events (e.g., login, logout, OAuth)
    supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      set({ session: currentSession, user: currentSession?.user || null, loading: false });
      
      // 🔥 OAUTH GOOGLE PROFILE PROTECTION
      // Agar user Google se aaya hai aur database mein uska profile nahi hai, toh automatic bana do
      if (currentSession?.user) {
        const u = currentSession.user;
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', u.id)
          .maybeSingle();

        if (!existingProfile) {
          const username = u.user_metadata?.name || u.user_metadata?.full_name || u.email?.split('@')[0] || "User";
          await supabase
            .from('profiles')
            .insert([{ id: u.id, username, streak_count: 1 }]);
        }
      }
    });
  },

  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  // 🔥 GOOGLE OAUTH TRIGGER ACTION
  loginWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
      },
    });
    if (error) throw error;
  },

  register: async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          name: metadata.name,
          phone: metadata.phone
        }
      }
    });
    if (error) throw error;
    
    // Create the profile record linked to the auth ID
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, username: metadata.name, streak_count: 1 }]);
      if (profileError) throw profileError;
    }
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, session: null });
  }
}));