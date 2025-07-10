import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { newsService, type SearchFilters } from '@/services/newsService';
import NewsCard from '@/components/NewsCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Search, Filter, X, Sparkles } from 'lucide-react';
import { categories, indianStates } from '../lib/constants';
import { cn } from '../lib/utils';

const StateNews = () => {
  const { state: stateParam } = useParams<{ state: string }>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();

  const stateObj = indianStates.find(s => s.id === stateParam);
  const stateName = stateObj?.name || (stateParam
    ? stateParam
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : '');

  const { data: stateNews, isLoading, error, refetch } = useQuery({
    queryKey: ['state-news', stateParam, selectedCategory],
    queryFn: () => {
      const filters: SearchFilters = {
        state: stateParam,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        limit: 20,
        query: selectedCategory !== 'all' ? selectedCategory : 'news' // Add a default query for NewsAPI
      };
      return newsService.searchWithFilters(filters);
    },
    enabled: !!stateParam,
  });

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Update URL with category filter
    const params = new URLSearchParams(searchParams);
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    navigate({ search: params.toString() }, { replace: true });
    
    // Scroll to top when changing categories
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6 animate-pulse">⚠️</div>
          <h2 className="text-3xl font-bold mb-4 text-red-500">Error Loading News</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Unable to fetch news for {stateName}. Please try again later.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              size="lg" 
              className="hover:shadow-lg transition-all duration-300"
              onClick={() => refetch()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                <path d="M16 16h5v5"/>
              </svg>
              Retry
            </Button>
            <Link to="/states">
              <Button variant="outline" size="lg" className="hover:shadow-lg transition-all duration-300">
                <ArrowLeft className="w-5 h-5 mr-2" />
                All States
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <Link to="/states">
              <Button variant="outline" size="sm" className="hover:shadow-lg transition-all duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                All States
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              className="hover:shadow-lg transition-all duration-300"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? (
                <X className="w-4 h-4 mr-2" />
              ) : (
                <Filter className="w-4 h-4 mr-2" />
              )}
              {showFilters ? 'Hide' : 'Filter'} Categories
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <MapPin className="w-8 h-8 text-primary animate-bounce flex-shrink-0" />
                <div>
                  <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                    News from {stateName}
                  </h1>
                  <p className="text-lg text-muted-foreground mt-2">
                    {selectedCategory !== 'all' ? `${categories.find(c => c.id === selectedCategory)?.display} in ` : ''}
                    {stateName} - Stay informed about local developments, politics, business, and more
                  </p>
                </div>
                <Sparkles className="w-6 h-6 text-primary animate-pulse hidden md:block ml-auto" />
              </div>
            </div>
          </div>
          
          <div className="sticky top-16 z-10 bg-background/80 backdrop-blur-sm py-4 -mx-4 px-4 border-b">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap gap-2 justify-start overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === 'all'
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  All News
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.display}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <LoadingSkeleton count={12} />
          ) : stateNews?.news && stateNews.news.length > 0 ? (
            <>
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 bg-muted/50 px-6 py-3 rounded-full">
                  <span className="text-sm font-medium text-muted-foreground">
                    Found {stateNews.count || stateNews.news.length} {selectedCategory !== 'all' ? categories.find(c => c.id === selectedCategory)?.display.toLowerCase() : ''} 
                    article{stateNews.count === 1 ? '' : 's'} in {stateName}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                {stateNews.news.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-9xl mb-8 animate-bounce">📰</div>
              <h3 className="text-3xl font-semibold mb-6">No News Found</h3>
              <p className="text-muted-foreground mb-12 max-w-2xl mx-auto text-xl leading-relaxed">
                We couldn't find any recent news for {stateName}.
                This might be due to limited coverage or API limitations. Try checking back later or explore other states.
              </p>
              <Link to="/states">
                <Button size="lg" className="hover:shadow-lg transition-all duration-300">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Explore Other States
                </Button>
              </Link>
            </div>
          )}
        </div>

        {isLoading ? (
          <LoadingSkeleton count={12} />
        ) : stateNews?.news && stateNews.news.length > 0 ? (
          <>
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 bg-muted/50 px-6 py-3 rounded-full">
                <span className="text-sm font-medium text-muted-foreground">
                  Found {stateNews.count || stateNews.news.length} {selectedCategory !== 'all' ? categories.find(c => c.id === selectedCategory)?.display.toLowerCase() : ''} 
                  article{stateNews.count === 1 ? '' : 's'} in {stateName}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
              {stateNews.news.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-9xl mb-8 animate-bounce">📰</div>
            <h3 className="text-3xl font-semibold mb-6">No News Found</h3>
            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto text-xl leading-relaxed">
              We couldn't find any recent news for {stateName}.
              This might be due to limited coverage or API limitations. Try checking back later or explore other states.
            </p>
            <Link to="/states">
              <Button size="lg" className="hover:shadow-lg transition-all duration-300">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Explore Other States
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StateNews;
