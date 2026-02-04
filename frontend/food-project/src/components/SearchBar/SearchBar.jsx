import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Loader2 } from 'lucide-react';

function SearchBar({ onSearch, loading = false }) {
  const [query, setQuery] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      await onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="flex gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for restaurants, cuisines, or dishes..."
          disabled={loading}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !query.trim()} size="icon" className="shrink-0" aria-label="Search">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Search className="size-4" />
          )}
        </Button>
      </div>
    </form>
  );
}

export default SearchBar;
