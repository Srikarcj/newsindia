
import React, { useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { newsService } from '@/services/newsService'; // Removed unused SearchFilters import
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FolderOpen, MapPin, X } from 'lucide-react';
import { categories, indianStates } from '../lib/constants';
import { cn } from '../lib/utils';

interface State {
  id: string;
  name: string;
}

interface Category {
  id: string;
  display: string;
  icon?: string;
}

const CategoryNews = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showStateFilter, setShowStateFilter] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(
    searchParams.get('state')
  );
  
  const formatCategoryName = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.id === category?.toLowerCase());
    return categoryData?.icon || '📂';
  };

  const handleStateSelect = (stateId: string) => {
    const params = new URLSearchParams(searchParams);
    if (stateId === 'all') {
      params.delete('state');
      setSelectedState(null);
    } else {
      params.set('state', stateId);
      setSelectedState(stateId);
    }
    setShowStateFilter(false);
    navigate({ search: params.toString() }, { replace: true });
  };

  const getStateName = (stateId: string | null) => {
    if (!stateId) return '';
    const state = indianStates.find(s => s.id === stateId);
    return state ? state.name : '';
  };

  const currentCategory = categories.find(cat => cat.id === category?.toLowerCase()) || {
    id: category || '',
    display: formatCategoryName(category || '')
  };

  const { data: categoryNews, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['category-news', category, selectedState],
    queryFn: () => {
      // Fetch exactly 12 articles (4 rows × 3 columns) for the category
      return newsService.getNewsByCategory(
        category || '', // category
        12, // limit - 12 articles for 4 rows of 3
        1, // page
        selectedState || undefined // state (optional)
      );
    },
    enabled: !!category,
  });

  if (error || !categoryNews?.news?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6 animate-pulse">⚠️</div>
          <h2 className="text-3xl font-bold mb-4 text-red-500">Error Loading News</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            {!categoryNews?.news?.length 
              ? `No ${currentCategory.display} news found${selectedState ? ` from ${getStateName(selectedState)}` : ''}.`
              : `Unable to fetch ${currentCategory.display} news${selectedState ? ` from ${getStateName(selectedState)}` : ''}. Please try again later.`
            }
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
            <Link to="/categories">
              <Button variant="outline" size="lg" className="hover:shadow-lg transition-all duration-300">
                <ArrowLeft className="w-5 h-5 mr-2" />
                All Categories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-12">
          <Link to="/categories" className="inline-block mb-6">
            <Button variant="outline" size="sm" className="hover:shadow-lg transition-all duration-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Categories
            </Button>
          </Link>
          
          <div className="relative">
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <FolderOpen className="w-8 h-8 text-primary animate-bounce flex-shrink-0" />
                  <div className="text-5xl md:text-6xl">{getCategoryIcon(category || '')}</div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                    {currentCategory.display}
                  </h1>
                </div>
                <div className="ml-auto flex items-center gap-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowStateFilter(!showStateFilter)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-full border transition-all',
                        'hover:shadow-md hover:bg-muted/50',
                        selectedState ? 'bg-primary/10 border-primary/20' : 'border-border',
                        'group'
                      )}
                    >
                      <MapPin className={cn(
                        'w-4 h-4 transition-colors',
                        selectedState ? 'text-primary' : 'text-muted-foreground'
                      )} />
                      <span className={cn(
                        'font-medium whitespace-nowrap',
                        selectedState ? 'text-primary' : 'text-muted-foreground'
                      )}>
                        {selectedState ? getStateName(selectedState) : 'Filter by State'}
                      </span>
                      {selectedState && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStateSelect('all');
                          }}
                          className="ml-2 p-1 rounded-full hover:bg-muted transition-colors"
                          aria-label="Clear state filter"
                        >
                          <X className="w-3 h-3 text-muted-foreground" />
                        </button>
                      )}
                    </button>
                    
                    {showStateFilter && (
                      <div className="absolute z-50 right-0 mt-2 w-64 bg-background rounded-xl shadow-xl border border-border overflow-hidden">
                        <div className="p-2 max-h-80 overflow-y-auto">
                          <button
                            onClick={() => handleStateSelect('all')}
                            className={cn(
                              'w-full text-left px-4 py-2 rounded-lg text-sm font-medium',
                              !selectedState ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
                            )}
                          >
                            All States
                          </button>
                          {indianStates.map((state) => (
                            <button
                              key={state.id}
                              onClick={() => handleStateSelect(state.id)}
                              className={cn(
                                'w-full text-left px-4 py-2 rounded-lg text-sm font-medium',
                                selectedState === state.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
                              )}
                            >
                              {state.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-lg text-muted-foreground max-w-3xl">
                {selectedState 
                  ? `Latest ${currentCategory.display.toLowerCase()} news from ${getStateName(selectedState)}`
                  : `Latest ${currentCategory.display.toLowerCase()} news from India`}
                {' '}- Stay updated with the most recent developments and trending stories
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-card rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                <div className="h-48 bg-muted/30 animate-pulse"></div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="h-4 bg-muted/30 rounded w-3/4 mb-3 animate-pulse"></div>
                  <div className="h-4 bg-muted/30 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-muted/30 rounded w-5/6 mb-4 animate-pulse"></div>
                  <div className="mt-auto">
                    <div className="h-3 bg-muted/30 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : categoryNews?.news && categoryNews.news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryNews.news.map((article) => (
              <div key={article.id} className="bg-card rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
                <div className="h-48 overflow-hidden bg-muted/30">
                  <img 
                    src={article.image || 'https://via.placeholder.com/800x400?text=No+Image'} 
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                    }}
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span>{new Date(article.published).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}</span>
                    {article.author && (
                      <span className="flex items-center">
                        <span className="mx-1">•</span>
                        <span className="line-clamp-1">By {article.author}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-3 line-clamp-3 leading-snug">
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {article.title}
                    </a>
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  
                  {article.content && (
                    <div className="prose prose-sm max-w-none text-foreground/90 mb-4">
                      <div 
                        className="prose-p:mb-4 prose-img:rounded-lg prose-img:w-full prose-img:max-h-96 prose-img:object-cover"
                        dangerouslySetInnerHTML={{ 
                          __html: article.content 
                            ? article.content.substring(0, 500) + (article.content.length > 500 ? '...' : '') 
                            : article.description 
                        }} 
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline inline-flex items-center"
                    >
                      Read full article
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 w-4 h-4">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </a>
                    
                    {article.url && (
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {new URL(article.url).hostname.replace('www.', '')}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-9xl mb-8 animate-bounce">📰</div>
            <h3 className="text-3xl font-semibold mb-6">No News Found</h3>
            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto text-xl leading-relaxed">
              We couldn't find any recent {currentCategory.display.toLowerCase()} news.
              This might be due to limited coverage or API limitations. Try checking back later or explore other categories.
              Please try again later or explore other categories for the latest updates.
            </p>
            <Link to="/categories">
              <Button size="lg" className="hover:shadow-lg transition-all duration-300">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Browse Other Categories
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryNews;
