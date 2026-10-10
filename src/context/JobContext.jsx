import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { initialJobs } from '../data/mockJobs';
import { useAuth } from './AuthContext';

const JobContext = createContext();

export function JobProvider({ children }) {
  const { user, profile } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [userApplications, setUserApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial jobs
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (isConfigured && supabase) {
      try {
        const { data, error: fetchErr } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchErr) throw fetchErr;
        setJobs(data || []);
      } catch (err) {
        console.warn('Supabase fetch notice (database migration required in Supabase dashboard):', err.message);
        setError(err.message);
        const stored = localStorage.getItem('vacansee_local_jobs');
        if (stored) {
          try {
            setJobs(JSON.parse(stored));
          } catch {
            setJobs(initialJobs);
          }
        } else {
          setJobs(initialJobs);
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Local storage fallback
      const stored = localStorage.getItem('vacansee_local_jobs');
      if (stored) {
        try {
          setJobs(JSON.parse(stored));
        } catch {
          setJobs(initialJobs);
        }
      } else {
        setJobs(initialJobs);
        localStorage.setItem('vacansee_local_jobs', JSON.stringify(initialJobs));
      }
      setLoading(false);
    }
  }, []);

  // Fetch saved jobs for the logged in user
  const fetchSavedJobs = useCallback(async () => {
    if (!user) {
      setSavedJobIds(new Set());
      return;
    }

    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('saved_jobs')
          .select('job_id')
          .eq('user_id', user.id);

        if (!error && data) {
          setSavedJobIds(new Set(data.map((item) => item.job_id)));
        }
      } catch (err) {
        console.warn('Error fetching saved jobs from Supabase, checking local cache:', err.message);
        const stored = localStorage.getItem(`vacansee_saved_${user.id}`);
        if (stored) {
          try { setSavedJobIds(new Set(JSON.parse(stored))); } catch {}
        }
      }
    } else {
      const stored = localStorage.getItem(`vacansee_saved_${user.id}`);
      if (stored) {
        try {
          setSavedJobIds(new Set(JSON.parse(stored)));
        } catch {
          setSavedJobIds(new Set());
        }
      } else {
        setSavedJobIds(new Set());
      }
    }
  }, [user]);

  // Fetch user applications
  const fetchUserApplications = useCallback(async () => {
    if (!user) {
      setUserApplications([]);
      return;
    }

    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*, jobs(*)')
          .eq('applicant_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setUserApplications(data);
        }
      } catch (err) {
        console.warn('Error fetching applications from Supabase, checking local cache:', err.message);
        const stored = localStorage.getItem('vacansee_local_apps');
        if (stored) {
          try {
            const allApps = JSON.parse(stored);
            setUserApplications(allApps.filter((a) => a.applicant_id === user.id));
          } catch {}
        }
      }
    } else {
      const stored = localStorage.getItem('vacansee_local_apps');
      if (stored) {
        try {
          const allApps = JSON.parse(stored);
          const userApps = allApps.filter((a) => a.applicant_id === user.id);
          setUserApplications(userApps);
        } catch {
          setUserApplications([]);
        }
      } else {
        setUserApplications([]);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    if (user) {
      fetchSavedJobs();
      fetchUserApplications();
    } else {
      setSavedJobIds(new Set());
      setUserApplications([]);
    }
  }, [user, fetchSavedJobs, fetchUserApplications]);

  // Create Job
  const createJob = async (jobData) => {
    if (!user) throw new Error('You must be logged in to post a job');

    const formattedData = {
      ...jobData,
      employer_id: user.id,
      vacancies: Number(jobData.vacancies) || 1,
      salary_min: jobData.salary_min ? Number(jobData.salary_min) : null,
      salary_max: jobData.salary_max ? Number(jobData.salary_max) : null,
      requirements: Array.isArray(jobData.requirements)
        ? jobData.requirements
        : String(jobData.requirements || '').split('\n').filter(Boolean),
      benefits: Array.isArray(jobData.benefits)
        ? jobData.benefits
        : String(jobData.benefits || '').split('\n').filter(Boolean),
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('jobs')
        .insert([formattedData])
        .select()
        .single();

      if (error) throw error;
      setJobs((prev) => [data, ...prev]);
      return data;
    } else {
      const newJob = {
        ...formattedData,
        id: 'job-' + Date.now(),
      };
      const updated = [newJob, ...jobs];
      setJobs(updated);
      localStorage.setItem('vacansee_local_jobs', JSON.stringify(updated));
      return newJob;
    }
  };

  // Update Job
  const updateJob = async (jobId, updates) => {
    const formattedUpdates = {
      ...updates,
      vacancies: updates.vacancies !== undefined ? Number(updates.vacancies) : undefined,
      salary_min: updates.salary_min !== undefined ? (updates.salary_min ? Number(updates.salary_min) : null) : undefined,
      salary_max: updates.salary_max !== undefined ? (updates.salary_max ? Number(updates.salary_max) : null) : undefined,
      requirements: typeof updates.requirements === 'string'
        ? updates.requirements.split('\n').filter(Boolean)
        : updates.requirements,
      benefits: typeof updates.benefits === 'string'
        ? updates.benefits.split('\n').filter(Boolean)
        : updates.benefits,
      updated_at: new Date().toISOString(),
    };

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('jobs')
        .update(formattedUpdates)
        .eq('id', jobId)
        .select()
        .single();

      if (error) throw error;
      setJobs((prev) => prev.map((j) => (j.id === jobId ? data : j)));
      return data;
    } else {
      const updated = jobs.map((j) => (j.id === jobId ? { ...j, ...formattedUpdates } : j));
      setJobs(updated);
      localStorage.setItem('vacansee_local_jobs', JSON.stringify(updated));
      return updated.find((j) => j.id === jobId);
    }
  };

  // Toggle Job Status (active / closed)
  const toggleJobStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';
    return updateJob(jobId, { status: newStatus });
  };

  // Apply to Job
  const applyToJob = async ({ jobId, coverNote, resumeLink, contactPhone, applicantName, applicantEmail }) => {
    if (!user) throw new Error('Please sign in to submit your application');

    // Check duplicate
    const alreadyApplied = userApplications.some((a) => a.job_id === jobId);
    if (alreadyApplied) {
      throw new Error('You have already applied for this position.');
    }

    const applicationPayload = {
      job_id: jobId,
      applicant_id: user.id,
      cover_note: coverNote || '',
      resume_link: resumeLink || '',
      contact_phone: contactPhone || profile?.phone || '',
      status: 'applied',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('applications')
        .insert([applicationPayload])
        .select('*, jobs(*)')
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('You have already submitted an application for this vacancy.');
        }
        throw error;
      }
      setUserApplications((prev) => [data, ...prev]);
      return data;
    } else {
      const matchedJob = jobs.find((j) => j.id === jobId) || {};
      const newApp = {
        ...applicationPayload,
        id: 'app-' + Date.now(),
        jobs: matchedJob,
        applicant_name: applicantName || profile?.full_name || 'Applicant',
        applicant_email: applicantEmail || user.email,
      };

      const stored = localStorage.getItem('vacansee_local_apps');
      const allApps = stored ? JSON.parse(stored) : [];
      const updated = [newApp, ...allApps];
      localStorage.setItem('vacansee_local_apps', JSON.stringify(updated));
      setUserApplications((prev) => [newApp, ...prev]);
      return newApp;
    }
  };

  // Toggle Save Job
  const toggleSaveJob = async (jobId) => {
    if (!user) throw new Error('Please sign in to save jobs');

    const isSaved = savedJobIds.has(jobId);

    if (isConfigured && supabase) {
      if (isSaved) {
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('job_id', jobId)
          .eq('user_id', user.id);

        if (error) throw error;
        setSavedJobIds((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
      } else {
        const { error } = await supabase
          .from('saved_jobs')
          .insert([{ job_id: jobId, user_id: user.id }]);

        if (error) throw error;
        setSavedJobIds((prev) => new Set(prev).add(jobId));
      }
    } else {
      setSavedJobIds((prev) => {
        const next = new Set(prev);
        if (isSaved) {
          next.delete(jobId);
        } else {
          next.add(jobId);
        }
        localStorage.setItem(`vacansee_saved_${user.id}`, JSON.stringify(Array.from(next)));
        return next;
      });
    }
  };

  // Get single job by ID
  const getJobById = (jobId) => {
    return jobs.find((j) => String(j.id) === String(jobId));
  };

  // Employer: Get applicants for a specific job
  const getJobApplicants = async (jobId) => {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('applications')
        .select('*, profiles:applicant_id(*)')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } else {
      const stored = localStorage.getItem('vacansee_local_apps');
      if (!stored) return [];
      const allApps = JSON.parse(stored);
      return allApps.filter((a) => String(a.job_id) === String(jobId));
    }
  };

  // Employer: Update application status ('applied', 'reviewing', 'shortlisted', 'rejected', 'hired')
  const updateApplicationStatus = async (appId, newStatus) => {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', appId)
        .select()
        .single();

      if (error) throw error;

      // Update in local state if relevant
      setUserApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      );
      return data;
    } else {
      const stored = localStorage.getItem('vacansee_local_apps');
      if (stored) {
        const allApps = JSON.parse(stored);
        const updated = allApps.map((a) => (a.id === appId ? { ...a, status: newStatus } : a));
        localStorage.setItem('vacansee_local_apps', JSON.stringify(updated));

        setUserApplications((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
        );
      }
      return { id: appId, status: newStatus };
    }
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        loading,
        error,
        savedJobIds,
        userApplications,
        fetchJobs,
        createJob,
        updateJob,
        toggleJobStatus,
        applyToJob,
        toggleSaveJob,
        getJobById,
        getJobApplicants,
        updateApplicationStatus,
        isJobSaved: (jobId) => savedJobIds.has(jobId),
        hasApplied: (jobId) => userApplications.some((a) => String(a.job_id) === String(jobId)),
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}

