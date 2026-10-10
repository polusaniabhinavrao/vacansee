import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { demoSeekerUser, demoEmployerUser } from '../data/mockJobs';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    let subscription = null;

    async function initAuth() {
      setLoading(true);
      if (isConfigured && supabase) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Error fetching session:', error);
          }
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id);
          } else {
            setUser(null);
            setProfile(null);
          }

          const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
              setUser(session.user);
              await fetchProfile(session.user.id);
            } else {
              setUser(null);
              setProfile(null);
            }
          });
          subscription = data?.subscription;
        } catch (err) {
          console.error('Supabase auth initialization error:', err);
        } finally {
          setLoading(false);
        }
      } else {
        // Fallback demo mode: load persisted demo user if present
        const savedDemoProfile = localStorage.getItem('vacansee_demo_profile');
        if (savedDemoProfile) {
          try {
            const parsed = JSON.parse(savedDemoProfile);
            setUser({ id: parsed.id, email: parsed.email });
            setProfile(parsed);
          } catch (e) {
            console.error('Failed to parse saved demo profile', e);
          }
        }
        setLoading(false);
      }
    }

    initAuth();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  async function fetchProfile(userId) {
    if (!isConfigured || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Profile fetch warning (may need retry or initial insertion):', error.message);
      } else if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  }

  // Register function
  async function register({ email, password, role, fullName, phone, companyName, location }) {
    setAuthError(null);
    if (isConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            full_name: fullName,
            phone,
            company_name: companyName,
            location,
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        throw error;
      }

      // If user created, ensure profile is inserted if trigger didn't fire
      if (data?.user) {
        setUser(data.user);
        const newProfile = {
          id: data.user.id,
          role: role || 'seeker',
          full_name: fullName || email.split('@')[0],
          email: email,
          phone: phone || '',
          company_name: companyName || '',
          location: location || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { error: profError } = await supabase.from('profiles').upsert(newProfile);
        if (!profError) {
          setProfile(newProfile);
        }
      }
      return data;
    } else {
      // Local demo mode registration
      const demoId = 'user-' + Date.now();
      const newProfile = {
        id: demoId,
        email,
        role: role || 'seeker',
        full_name: fullName || email.split('@')[0],
        phone: phone || '',
        company_name: companyName || '',
        location: location || 'Hyderabad',
        headline: role === 'seeker' ? 'Candidate | ' + fullName : 'Hiring Lead at ' + (companyName || 'Business'),
        bio: '',
        skills: role === 'seeker' ? ['Telugu', 'English'] : [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const demoUser = { id: demoId, email };
      setUser(demoUser);
      setProfile(newProfile);
      localStorage.setItem('vacansee_demo_profile', JSON.stringify(newProfile));
      return { user: demoUser, profile: newProfile };
    }
  }

  // Login function
  async function login({ email, password }) {
    setAuthError(null);
    if (isConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message);
        throw error;
      }

      if (data?.user) {
        setUser(data.user);
        await fetchProfile(data.user.id);
      }
      return data;
    } else {
      // If user entered demo credentials or any email in demo mode
      const isEmployer = email.toLowerCase().includes('emp') || email.toLowerCase().includes('hr') || email.toLowerCase().includes('deccan');
      const base = isEmployer ? demoEmployerUser : demoSeekerUser;
      const loggedProfile = {
        ...base,
        email: email || base.email,
        id: 'user-' + (isEmployer ? 'emp-tech-1' : 'demo-seeker-001'),
      };
      setUser({ id: loggedProfile.id, email: loggedProfile.email });
      setProfile(loggedProfile);
      localStorage.setItem('vacansee_demo_profile', JSON.stringify(loggedProfile));
      return { user: { id: loggedProfile.id, email: loggedProfile.email }, profile: loggedProfile };
    }
  }

  // Demo switch helper
  function loginDemo(role = 'seeker') {
    const demo = role === 'employer' ? demoEmployerUser : demoSeekerUser;
    setUser({ id: demo.id, email: demo.email });
    setProfile(demo);
    localStorage.setItem('vacansee_demo_profile', JSON.stringify(demo));
  }

  // Logout function
  async function logout() {
    setAuthError(null);
    if (isConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('vacansee_demo_profile');
  }

  // Update profile
  async function updateProfile(updates) {
    if (isConfigured && supabase && user) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      setProfile(data);
      return data;
    } else {
      const updated = { ...profile, ...updates, updated_at: new Date().toISOString() };
      setProfile(updated);
      localStorage.setItem('vacansee_demo_profile', JSON.stringify(updated));
      return updated;
    }
  }

  const role = profile?.role || 'guest';
  const isSeeker = role === 'seeker';
  const isEmployer = role === 'employer';
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isSeeker,
        isEmployer,
        isAuthenticated,
        loading,
        authError,
        register,
        login,
        loginDemo,
        logout,
        updateProfile,
        isConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

