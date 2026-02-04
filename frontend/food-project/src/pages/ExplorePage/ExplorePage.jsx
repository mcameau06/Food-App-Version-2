import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router';
import SearchBar from '@/components/SearchBar/SearchBar';
import RestaurantCard from '@/components/RestaurantCard/RestaurantCard';
import useGeolocation from '@/hooks/useGeolocation';
import { searchRestaurants } from '@/services/api';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Search, Loader2 } from 'lucide-react';

function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { lat, lng, loading: geoLoading, error: geoError, retry: retryGeolocation } = useGeolocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const hasAutoSearched = useRef(false);

  const query = searchParams.get('q') || '';

  const handleSearch = useCallback(
    async (searchQuery) => {
      if (!lat || !lng) {
        setError('Location is required for search. Please enable location access.');
        return;
      }
      setLoading(true);
      setError(null);
      setHasSearched(true);
      setSearchParams({ q: searchQuery });
      try {
        const data = await searchRestaurants(searchQuery, lat, lng);
        setResults(data || []);
      } catch (err) {
        setError('Failed to search restaurants. Please try again.');
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [lat, lng, setSearchParams]
  );

  useEffect(() => {
    if (query && lat != null && lng != null && !geoLoading && !hasAutoSearched.current) {
      hasAutoSearched.current = true;
      handleSearch(query);
    }
  }, [query, lat, lng, geoLoading, handleSearch]);

  if (geoLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
          <Loader2 className="size-10 animate-spin" />
          <p>Getting your location...</p>
        </div>
      </div>
    );
  }

  if (geoError) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
          <AlertCircle className="size-12 text-destructive" />
          <h2 className="text-xl font-semibold">Location Access Required</h2>
          <p className="text-muted-foreground">{geoError}</p>
          <p className="text-sm text-muted-foreground">
            Enable location in your browser or device settings, then try again.
          </p>
          {retryGeolocation && (
            <Button variant="outline" onClick={retryGeolocation} className="mt-2">
              Try again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold md:text-3xl">Explore Restaurants</h1>
        <p className="mt-2 text-muted-foreground">
          Search for restaurants, cuisines, or dishes near you
        </p>
      </header>

      <div className="mb-8">
        <SearchBar onSearch={handleSearch} loading={loading} />
      </div>

      {error && (
        <div
          className="mb-6 flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          <AlertCircle className="size-5 shrink-0" />
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
          <Loader2 className="size-10 animate-spin" />
          <p>Searching for restaurants...</p>
        </div>
      )}

      {!loading && hasSearched && results.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center text-muted-foreground">
          <Search className="size-16 opacity-50" />
          <h2 className="text-xl font-semibold text-foreground">No restaurants found</h2>
          <p>Try adjusting your search query or location.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">
            {results.length} {results.length === 1 ? 'Restaurant' : 'Restaurants'} Found
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((place) => (
              <RestaurantCard key={place.place_id} place={place} />
            ))}
          </div>
        </section>
      )}

      {!hasSearched && !loading && (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center text-muted-foreground">
          <Search className="size-20 opacity-50" />
          <h2 className="text-xl font-semibold text-foreground">Ready to explore?</h2>
          <p>Start by searching for a restaurant, cuisine, or dish above.</p>
        </div>
      )}
    </div>
  );
}

export default ExplorePage;
