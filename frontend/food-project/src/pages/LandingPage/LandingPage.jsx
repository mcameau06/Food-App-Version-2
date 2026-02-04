import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Heart } from 'lucide-react';

function LandingPage() {
  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description:
        'Find restaurants by name, cuisine, or dish. Our intelligent search helps you discover exactly what you\'re craving.',
    },
    {
      icon: MapPin,
      title: 'Location Based',
      description:
        'Get personalized recommendations based on your current location. Find the best spots near you.',
    },
    {
      icon: Heart,
      title: 'Save Favorites',
      description:
        'Keep track of your favorite restaurants. Build your personal collection of go-to spots.',
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <section className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Discover Your Next Favorite Meal
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Find the perfect restaurant near you with FoodFindr. Search by cuisine, location, or dish
          and discover amazing dining experiences.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/explore">Start Exploring</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/favorites">View Favorites</Link>
          </Button>
        </div>
      </section>

      <section className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="transition-shadow hover:shadow-md">
            <CardContent className="pt-6">
              <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icon className="size-6" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

export default LandingPage;
