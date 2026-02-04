import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/explore', label: 'Explore' },
    { to: '/favorites', label: 'Favorites' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <Link
          to="/"
          className="text-lg font-semibold text-foreground hover:opacity-90"
        >
          FoodFindr
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ to, label }) => (
            <Button
              key={to}
              variant={isActive(to) ? 'secondary' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to={to}>{label}</Link>
            </Button>
          ))}
          {!authLoading &&
            (user ? (
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Log out
              </Button>
            ) : (
              <Button variant={isActive('/login') ? 'secondary' : 'ghost'} size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
            ))}
        </nav>

        {/* Mobile: sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-2">
              {navLinks.map(({ to, label }) => (
                <Button
                  key={to}
                  variant={isActive(to) ? 'secondary' : 'ghost'}
                  className="justify-start"
                  asChild
                  onClick={() => setMobileOpen(false)}
                >
                  <Link to={to}>{label}</Link>
                </Button>
              ))}
              {!authLoading &&
                (user ? (
                  <Button variant="ghost" className="justify-start" onClick={handleSignOut}>
                    Log out
                  </Button>
                ) : (
                  <Button
                    variant={isActive('/login') ? 'secondary' : 'ghost'}
                    className="justify-start"
                    asChild
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default Navbar;
