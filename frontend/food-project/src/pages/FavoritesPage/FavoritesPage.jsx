import { Link } from 'react-router';
import RestaurantCard from '@/components/RestaurantCard/RestaurantCard';
import { Button } from '@/components/ui/button';
import { Heart, Loader2, X } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';

function FavoritesPage() {
  const { favorites, loading, removeFavorite } = useFavorites();

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
          <Loader2 className="size-10 animate-spin" />
          <p>Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold md:text-3xl">My Favorites</h1>
        <p className="mt-2 text-muted-foreground">
          {favorites.length === 0
            ? 'Start saving restaurants to see them here'
            : `${favorites.length} ${favorites.length === 1 ? 'restaurant' : 'restaurants'} saved`}
        </p>
      </header>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center text-muted-foreground">
          <Heart className="size-20 opacity-50" />
          <h2 className="text-xl font-semibold text-foreground">No favorites yet</h2>
          <p>Start exploring and save your favorite restaurants!</p>
          <Button asChild>
            <Link to="/explore">Explore Restaurants</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => {
            const placeId = favorite.place_id || favorite.google_place_id;
            const placeData = {
              place_id: placeId,
              name: favorite.name || 'Unknown Restaurant',
              address: favorite.address || '',
              rating: favorite.rating ?? null,
              open_now: favorite.open_now ?? null,
              price_level: favorite.price_level ?? null,
              photo_urls: favorite.photo_urls || [],
              lat: favorite.lat,
              lng: favorite.lng,
            };
            return (
              <div key={placeId} className="flex flex-col gap-3">
                <RestaurantCard place={placeData} />
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => removeFavorite(placeId)}
                  aria-label="Remove from favorites"
                >
                  <X className="size-4" />
                  Remove
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
