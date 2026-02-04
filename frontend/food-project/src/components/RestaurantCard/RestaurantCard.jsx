import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/context/FavoritesContext';

function RestaurantCard({ place }) {
  const {
    name,
    address,
    rating,
    open_now,
    price_level,
    photo_urls = [],
    place_id,
  } = place || {};

  const { addFavorite, removeFavorite, isFavorited } = useFavorites();
  const favorited = isFavorited(place_id);

  const [api, setApi] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    return () => api.off('select', onSelect);
  }, [api]);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorited) {
      removeFavorite(place_id);
    } else {
      addFavorite({
        place_id,
        name,
        address,
        rating,
        open_now,
        price_level,
        photo_urls,
        lat: place?.lat ?? null,
        lng: place?.lng ?? null,
      });
    }
  };

  const renderStars = (r) => {
    if (r == null) return null;
    const full = Math.floor(r);
    const half = r % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < full; i++) {
      stars.push(<Star key={i} className="size-4 fill-amber-400 text-amber-400" />);
    }
    if (half) {
      stars.push(<Star key="half" className="size-4 fill-amber-400/60 text-amber-400/60" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={`e-${i}`} className="size-4 text-muted-foreground/30" />);
    }
    return stars;
  };

  const hasImages = photo_urls?.length > 0;
  const hasMultipleImages = photo_urls?.length > 1;

  return (
    <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
        {/* Gallery: Carousel or placeholder */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
          {hasImages ? (
            <Carousel
              setApi={setApi}
              opts={{ align: 'start', loop: true }}
              className="w-full"
            >
              <CarouselContent className="ml-0">
                {photo_urls.map((url, i) => (
                  <CarouselItem key={i} className="pl-0">
                    <img
                      src={url}
                      alt={`${name} – ${i + 1}`}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {hasMultipleImages && (
                <span className="contents" onClick={(e) => e.stopPropagation()}>
                  <CarouselPrevious
                    variant="secondary"
                    size="icon"
                    className="left-2 top-1/2 size-8 -translate-y-1/2 rounded-full border-0 bg-black/50 text-primary-foreground hover:bg-black/70"
                  />
                  <CarouselNext
                    variant="secondary"
                    size="icon"
                    className="right-2 top-1/2 size-8 -translate-y-1/2 rounded-full border-0 bg-black/50 text-primary-foreground hover:bg-black/70"
                  />
                </span>
              )}
            </Carousel>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <MapPin className="size-12 opacity-40" />
            </div>
          )}

          {/* Dot indicators */}
          {hasMultipleImages && photo_urls.length <= 8 && (
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {photo_urls.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    api?.scrollTo(i);
                  }}
                  aria-label={`View image ${i + 1}`}
                  className={cn(
                    'size-2 rounded-full transition-all',
                    i === selectedIndex ? 'w-5 bg-primary-foreground' : 'bg-primary-foreground/50'
                  )}
                />
              ))}
            </div>
          )}

          {/* Favorite button */}
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute right-2 top-2 size-9 rounded-full border-0 bg-black/40 shadow-md backdrop-blur-sm hover:bg-black/60"
            onClick={handleFavoriteClick}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={cn('size-4 text-primary-foreground', favorited && 'fill-current')} />
          </Button>
        </div>

        <CardContent className="flex flex-col gap-2 p-4">
          <h3 className="line-clamp-2 font-semibold leading-tight">{name}</h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {rating != null && (
              <div className="flex items-center gap-1">
                <span className="flex gap-0.5">{renderStars(rating)}</span>
                <span className="text-sm font-medium">{Number(rating).toFixed(1)}</span>
              </div>
            )}
            {price_level != null && (
              <span className="text-sm text-muted-foreground">{'$'.repeat(price_level)}</span>
            )}
          </div>

          {address && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{address}</p>
          )}

          {open_now !== undefined && (
            <Badge
              variant={open_now ? 'default' : 'secondary'}
              className="mt-1 w-fit text-xs"
            >
              {open_now ? 'Open now' : 'Closed'}
            </Badge>
          )}
        </CardContent>
      </Card>
  );
}

export default RestaurantCard;
