import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getFavorites, addFavorite as apiAddFavorite, removeFavorite as apiRemoveFavorite } from '@/services/api';

const FavoritesContext = createContext(null);

function normalizeFavorite(item) {
  return {
    place_id: item.place_id ?? item.google_place_id,
    google_place_id: item.google_place_id ?? item.place_id,
    name: item.name ?? 'Unknown Restaurant',
    address: item.address ?? '',
    rating: item.rating ?? null,
    open_now: item.open_now ?? null,
    price_level: item.price_level ?? null,
    photo_urls: item.photo_urls ?? [],
    lat: item.lat,
    lng: item.lng,
    created_at: item.created_at,
  };
}

export function FavoritesProvider({ children }) {
  const { user, session, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      if (isAuthenticated && user?.id && session?.access_token) {
        const data = await getFavorites(session.access_token);
        const list = Array.isArray(data) ? data : data?.favorites ?? [];
        setFavorites(list.map(normalizeFavorite));
      } else {
        const stored = localStorage.getItem('favorites');
        const parsed = stored ? JSON.parse(stored) : [];
        setFavorites(parsed.map(normalizeFavorite));
      }
    } catch (err) {
      console.error('Error loading favorites:', err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id, session?.access_token]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const handleStorage = () => loadFavorites();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [isAuthenticated, loadFavorites]);

  const addFavorite = useCallback(
    async (place) => {
      const payload = {
        place_id: place.place_id,
        place_name: place.name ?? 'Unknown',
        lat: Number(place.lat) ?? 0,
        lng: Number(place.lng) ?? 0,
      };
      if (isAuthenticated && user?.id && session?.access_token) {
        await apiAddFavorite(payload, session.access_token);
        await loadFavorites();
      } else {
        const stored = JSON.parse(localStorage.getItem('favorites') || '[]');
        const next = [...stored, { ...place, savedAt: new Date().toISOString() }];
        localStorage.setItem('favorites', JSON.stringify(next));
        setFavorites(next.map(normalizeFavorite));
      }
      window.dispatchEvent(new Event('storage'));
    },
    [isAuthenticated, user?.id, session?.access_token, loadFavorites]
  );

  const removeFavorite = useCallback(
    async (placeId) => {
      if (isAuthenticated && user?.id && session?.access_token) {
        await apiRemoveFavorite(placeId, session.access_token);
        await loadFavorites();
      } else {
        const stored = JSON.parse(localStorage.getItem('favorites') || '[]');
        const next = stored.filter((f) => (f.place_id || f.google_place_id) !== placeId);
        localStorage.setItem('favorites', JSON.stringify(next));
        setFavorites(next.map(normalizeFavorite));
      }
      window.dispatchEvent(new Event('storage'));
    },
    [isAuthenticated, user?.id, loadFavorites]
  );

  const isFavorited = useCallback(
    (placeId) => favorites.some((f) => (f.place_id || f.google_place_id) === placeId),
    [favorites]
  );

  const value = {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorited,
    refetch: loadFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
