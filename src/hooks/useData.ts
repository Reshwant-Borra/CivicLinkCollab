import { useState, useEffect } from 'react';
import { api, apiEndpoints } from '@/lib/api';

// Polling places hook
export const usePollingPlaces = (zipCode: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (zipCode && zipCode.length === 5) {
      setLoading(true);
      api.get(`${apiEndpoints.polling.getByZip}/${zipCode}`)
        .then(response => {
          setData(response.data);
          setError(null);
        })
        .catch(err => {
          setError(err.response?.data?.message || 'Failed to fetch polling place');
        })
        .finally(() => setLoading(false));
    }
  }, [zipCode]);

  return { data, loading, error };
};

// Deadlines hook
export const useDeadlines = (state?: string) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const endpoint = state ? `${apiEndpoints.deadlines.getByState}/${state}` : apiEndpoints.deadlines.get;
    
    api.get(endpoint)
      .then(response => {
        setData(response.data);
        setError(null);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to fetch deadlines');
      })
      .finally(() => setLoading(false));
  }, [state]);

  return { data, loading, error };
};

// Translations hook
export const useTranslations = (searchTerm: string, language: string) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchTerm || language) {
      setLoading(true);
      api.get(apiEndpoints.translations.search, {
        params: { term: searchTerm, language }
      })
        .then(response => {
          setData(response.data);
          setError(null);
        })
        .catch(err => {
          setError(err.response?.data?.message || 'Failed to fetch translations');
        })
        .finally(() => setLoading(false));
    }
  }, [searchTerm, language]);

  return { data, loading, error };
};

// Fact checks hook
export const useFactChecks = (searchTerm: string) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      api.get(apiEndpoints.factChecks.search, {
        params: { term: searchTerm }
      })
        .then(response => {
          setData(response.data);
          setError(null);
        })
        .catch(err => {
          setError(err.response?.data?.message || 'Failed to fetch fact checks');
        })
        .finally(() => setLoading(false));
    }
  }, [searchTerm]);

  return { data, loading, error };
};

// Organizer dashboard hook
export const useOrganizerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(apiEndpoints.organizer.dashboard)
      .then(response => {
        setData(response.data);
        setError(null);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};

// Ambassador leaderboard hook
export const useAmbassadorLeaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(apiEndpoints.ambassador.leaderboard)
      .then(response => {
        setData(response.data);
        setError(null);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to fetch leaderboard');
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};
