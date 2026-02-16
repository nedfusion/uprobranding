import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ServiceCategory } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & {
    password: string;
    serviceCategories?: ServiceCategory[];
    profilePicture?: File | null;
  }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        try {
          if (session?.user) {
            await loadUserProfile(session.user.id);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          setUser(null);
        }
      })();
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('users_profile')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;

    if (profile) {
      setUser({
        id: profile.id,
        email: (await supabase.auth.getUser()).data.user?.email || '',
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        type: profile.user_type,
        state: profile.state,
        lga: profile.lga,
        address: profile.address,
        profileImage: profile.profile_image,
        isVerified: profile.is_verified,
        createdAt: new Date(profile.created_at)
      });
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        await loadUserProfile(data.user.id);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User> & {
    password: string;
    serviceCategories?: ServiceCategory[];
    profilePicture?: File | null;
  }) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email!,
        password: userData.password
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      let profileImageUrl = null;
      if (userData.profilePicture) {
        const fileExt = userData.profilePicture.name.split('.').pop();
        const fileName = `${authData.user.id}.${fileExt}`;
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('profiles')
          .upload(fileName, userData.profilePicture);

        if (!uploadError && uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('profiles')
            .getPublicUrl(fileName);
          profileImageUrl = publicUrl;
        }
      }

      const { error: profileError } = await supabase
        .from('users_profile')
        .insert({
          id: authData.user.id,
          first_name: userData.firstName!,
          last_name: userData.lastName!,
          phone: userData.phone!,
          user_type: userData.type!,
          state: userData.state!,
          lga: userData.lga!,
          address: userData.address,
          profile_image: profileImageUrl,
          is_verified: false
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }

      if (userData.type === 'service_provider' && userData.serviceCategories) {
        const { error: providerError } = await supabase
          .from('service_providers')
          .insert({
            user_id: authData.user.id,
            service_categories: userData.serviceCategories,
            bio: '',
            experience_years: 0,
            rating: 0,
            total_jobs: 0
          });

        if (providerError) {
          console.error('Provider profile creation error:', providerError);
          throw new Error(`Failed to create provider profile: ${providerError.message}`);
        }
      }

      await loadUserProfile(authData.user.id);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}