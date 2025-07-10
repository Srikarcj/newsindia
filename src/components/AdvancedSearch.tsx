
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SearchFilters {
  query: string;
  category: string;
  sortBy: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

const CATEGORIES = [
  'all', 'business', 'sports', 'technology', 'science', 
  'health', 'entertainment', 'politics', 'education'
];

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'relevance', label: 'Most Relevant' }
];

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch, isLoading }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    sortBy: 'latest'
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const clearFilters = () => {
    const cleared = { query: '', category: 'all', sortBy: 'latest' };
    setFilters(cleared);
    onSearch(cleared);
  };

  const hasActiveFilters = filters.query || filters.category !== 'all' || filters.sortBy !== 'latest';

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search news articles..."
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                className="pl-10"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button type="submit" disabled={isLoading} className="shrink-0">
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {hasActiveFilters && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {filters.query && (
                <Badge variant="secondary">
                  Search: {filters.query}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setFilters(prev => ({ ...prev, query: '' }))}
                  />
                </Badge>
              )}
              {filters.category !== 'all' && (
                <Badge variant="secondary">
                  Category: {filters.category}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}
                  />
                </Badge>
              )}
              {filters.sortBy !== 'latest' && (
                <Badge variant="secondary">
                  Sort: {SORT_OPTIONS.find(opt => opt.value === filters.sortBy)?.label}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setFilters(prev => ({ ...prev, sortBy: 'latest' }))}
                  />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
