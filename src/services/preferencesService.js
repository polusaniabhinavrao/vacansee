import { supabase, isConfigured } from '../lib/supabase';

const LOCAL_STORAGE_PREFIX = 'vacansee_seeker_preferences_';

/**
 * Service to manage Seeker Discovery Questionnaire preferences.
 * Seamlessly interfaces with Supabase (seeker_preferences table)
 * with robust local persistence fallback for offline and demo sessions.
 */
export async function getSeekerPreferences(userId = 'guest') {
  // 1. Try Supabase if configured and authenticated
  if (isConfigured && supabase && userId && userId !== 'guest') {
    try {
      const { data, error } = await supabase
        .from('seeker_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data) {
        // Also sync to local cache
        localStorage.setItem(LOCAL_STORAGE_PREFIX + userId, JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn('Failed to fetch preferences from Supabase, checking local cache:', err);
    }
  }

  // 2. Fallback to localStorage
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + userId);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading preferences from localStorage:', err);
  }

  return null;
}

/**
 * Persists questionnaire answers to Supabase and local cache.
 */
export async function saveSeekerPreferences(userId = 'guest', preferencesData) {
  const payload = {
    ...preferencesData,
    updated_at: new Date().toISOString(),
  };

  // Always save to localStorage immediately for instant offline resilience
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + userId, JSON.stringify(payload));
  } catch (err) {
    console.error('Error saving preferences to localStorage:', err);
  }

  // If Supabase is configured and authenticated user exists
  if (isConfigured && supabase && userId && userId !== 'guest') {
    try {
      const dbRow = {
        user_id: userId,
        education_level: payload.education_level || 'Undergraduate degree',
        education_field: payload.education_field || '',
        education_status: payload.education_status || 'completed',
        graduation_year: payload.graduation_year ? parseInt(payload.graduation_year, 10) : null,
        skills: Array.isArray(payload.skills) ? payload.skills : [],
        interests: Array.isArray(payload.interests) ? payload.interests : [],
        experience_level: payload.experience_level || 'fresher',
        experience_details: payload.experience_details || '',
        work_types: Array.isArray(payload.work_types) ? payload.work_types : [],
        preferred_sectors: Array.isArray(payload.preferred_sectors) ? payload.preferred_sectors : [],
        preferred_city: payload.preferred_city || 'Hyderabad',
        work_mode: payload.work_mode || 'no_preference',
        max_commute_km: payload.max_commute_km ? parseInt(payload.max_commute_km, 10) : null,
        available_days: Array.isArray(payload.available_days) ? payload.available_days : [],
        available_shifts: Array.isArray(payload.available_shifts) ? payload.available_shifts : [],
        expected_salary_min: payload.expected_salary_min ? parseInt(payload.expected_salary_min, 10) : null,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('seeker_preferences')
        .upsert(dbRow, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) {
        console.warn('Supabase seeker_preferences upsert note (will use local fallback):', error.message);
      }

      // Also sync user profile skills and location so profile tab remains updated
      if (payload.skills || payload.preferred_city) {
        await supabase
          .from('profiles')
          .update({
            skills: payload.skills,
            location: payload.preferred_city,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);
      }

      return data || payload;
    } catch (err) {
      console.warn('Error syncing seeker preferences to Supabase:', err);
    }
  }

  return payload;
}

/**
 * Clears saved questionnaire preferences.
 */
export async function clearSeekerPreferences(userId = 'guest') {
  try {
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + userId);
  } catch (e) {
    console.error(e);
  }

  if (isConfigured && supabase && userId && userId !== 'guest') {
    try {
      await supabase
        .from('seeker_preferences')
        .delete()
        .eq('user_id', userId);
    } catch (err) {
      console.error('Error clearing preferences in Supabase:', err);
    }
  }
}

