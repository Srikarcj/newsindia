import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { newsService, NewsResponse } from '@/services/newsService';
import NewsCard from '@/components/NewsCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { AdvancedSearch } from '@/components/AdvancedSearch';
import { Pagination } from '@/components/Pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ChevronLeft, ChevronRight, RefreshCw, TrendingUp, Sparkles, FileSearch } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SearchFilters {
  query: string;
  category: string;
  sortBy: string;
}

const Index = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    sortBy: 'latest'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const { 
    data: latestNews, 
    isLoading: isLoadingLatest, 
    error: latestError, 
    refetch: refetchLatest 
  } = useQuery<NewsResponse>({
    queryKey: ['telugu-news', searchFilters, currentPage],
    queryFn: async () => {
      try {
        // Always fetch Telugu news from both states
        const apNews = await newsService.searchWithFilters({
          state: 'andhra-pradesh',
          limit: 9,  // Get 9 from AP
          page: currentPage,
          ...(searchFilters.query && { query: searchFilters.query }),
          ...(searchFilters.category !== 'all' && { category: searchFilters.category })
        });
        
        const tsNews = await newsService.searchWithFilters({
          state: 'telangana',
          limit: 9,  // Get 9 from Telangana
          page: currentPage,
          ...(searchFilters.query && { query: searchFilters.query }),
          ...(searchFilters.category !== 'all' && { category: searchFilters.category })
        });
        
        // Combine and take first 18 articles
        const combinedNews = {
          ...apNews,
          news: [...(apNews?.news || []), ...(tsNews?.news || [])].slice(0, 18),
          status: 'ok' as const,
          count: 18,
          page: currentPage
        };
        
        if (combinedNews.news.length > 0) {
          console.log('Fetched Telugu news:', combinedNews.news.length, 'articles');
          return combinedNews;
        }
        
        // Fallback to regular news if no Telugu news found
        console.log('No Telugu news found, falling back to regular news');
        return await newsService.getLatestNews(18, currentPage);
      } catch (error) {
        console.error('Error fetching Telugu news:', error);
        // Fallback to mock data if API fails
        const mockNews = await newsService.getLatestNews(18, currentPage);
        console.log('Using mock news data due to error');
        return mockNews;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2, // Retry failed requests twice
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  const { 
    data: trendingNews, 
    isLoading: isLoadingTrending,
    error: trendingError 
  } = useQuery<NewsResponse>({
    queryKey: ['trending-telugu-news'],
    queryFn: async () => {
      try {
        // Try to get trending news specifically from Telugu states
        const apTrending = await newsService.searchWithFilters({
          state: 'andhra-pradesh',
          sortBy: 'popularity',
          limit: 2
        });
        
        const tsTrending = await newsService.searchWithFilters({
          state: 'telangana',
          sortBy: 'popularity',
          limit: 2
        });
        
        const combinedTrending = {
          ...apTrending,
          news: [...(apTrending?.news || []), ...(tsTrending?.news || [])].slice(0, 4),
          status: 'ok' as const
        };
        
        if (combinedTrending.news.length > 0) {
          console.log('Fetched trending Telugu states news:', combinedTrending);
          return combinedTrending;
        }
        
        // Fallback to regular trending news
        console.log('Falling back to regular trending news');
        const trending = await newsService.getTrendingNews(4);
        return trending;
      } catch (error) {
        console.error('Error fetching trending Telugu states news:', error);
        // Fallback to mock trending news
        const mockTrending = await newsService.getTrendingNews(4);
        console.log('Using mock trending news data');
        return mockTrending;
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes for trending news
    refetchOnWindowFocus: true,
  });
  
  // Check if we have any news to display
  const hasResults = latestNews?.news && latestNews.news.length > 0;
  const isSearchActive = searchFilters.query !== '' || searchFilters.category !== 'all';
  
  // Log current state for debugging
  React.useEffect(() => {
    console.log('Latest news state:', {
      isLoading: isLoadingLatest,
      error: latestError,
      hasResults,
      newsCount: latestNews?.news?.length,
      searchFilters
    });
  }, [isLoadingLatest, latestError, hasResults, latestNews, searchFilters]);

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setCurrentPage(1);
    
    toast({
      title: "Search Updated",
      description: filters.query 
        ? `Searching for "${filters.query}"` 
        : `Showing ${filters.category === 'all' ? 'all categories' : filters.category} news`,
    });
  };

  const handleRefresh = () => {
    refetchLatest();
    toast({
      title: "Refreshing News",
      description: "Fetching the latest updates...",
    });
  };

  const nextSlide = () => {
    if (trendingNews?.news) {
      setCurrentSlide((prev) => (prev + 1) % trendingNews.news.length);
    }
  };

  const prevSlide = () => {
    if (trendingNews?.news) {
      setCurrentSlide((prev) => (prev - 1 + trendingNews.news.length) % trendingNews.news.length);
    }
  };

  React.useEffect(() => {
    if (trendingNews?.news && trendingNews.news.length > 0) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [trendingNews]);

  if (latestError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-destructive/50 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="text-destructive text-8xl mb-6 animate-pulse">⚠️</div>
            <h2 className="text-3xl font-bold mb-4 text-destructive">Connection Error</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {latestError.message || 'Unable to connect to news service. Please check your connection and try again.'}
            </p>
            <Button onClick={handleRefresh} disabled={isLoadingLatest} size="lg" className="w-full">
              <RefreshCw className={`w-5 h-5 mr-2 ${isLoadingLatest ? 'animate-spin' : ''}`} />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {/* Enhanced Hero Section */}
        <section className="mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 rounded-3xl"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          <div className="relative text-center py-16 lg:py-24">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                NewsIndia
              </h1>
              <Sparkles className="w-8 h-8 text-primary animate-pulse delay-500" />
            </div>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Your ultimate destination for breaking news, trending stories, and comprehensive coverage from across India
            </p>
          </div>

          {/* Enhanced Trending Carousel */}
          {isLoadingTrending ? (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-8 h-8 text-primary animate-pulse" />
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Loading Trending...
                </h2>
              </div>
              <div className="h-[500px] w-full bg-muted/30 rounded-2xl animate-pulse"></div>
            </div>
          ) : trendingError ? (
            <div className="mb-12 p-6 bg-destructive/10 rounded-2xl border border-destructive/30">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-lg font-medium">Couldn't load trending news</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {trendingError.message || 'Failed to load trending stories. You can still browse the latest news below.'}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : trendingNews?.news && trendingNews.news.length > 0 ? (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-8 h-8 text-primary animate-bounce" />
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Trending Now
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
              </div>
              
              <div className="relative group">
                <Card className="overflow-hidden bg-gradient-to-br from-card via-card to-muted/10 border-0 shadow-2xl hover:shadow-3xl transition-all duration-700">
                  <CardContent className="p-0">
                    <div className="relative h-96 lg:h-[500px]">
                      {trendingNews.news.map((article, index) => (
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block h-full"
                          key={article.id}
                        >
                          <div
                            className={`absolute inset-0 transition-all duration-1000 ${
                              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                            }`}
                          >
                            <div className="grid lg:grid-cols-5 h-full">
                              <div className="lg:col-span-3 relative overflow-hidden group">
                                <img
                                  src={article.image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop'}
                                  alt={article.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4 lg:hidden">
                                  <h3 className="text-white text-xl font-bold mb-2 line-clamp-2">
                                    {article.title}
                                  </h3>
                                </div>
                              </div>
                              
                              <div className="lg:col-span-2 p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-background via-background to-muted/20">
                                <div className="hidden lg:block">
                                  <a 
                                    href={article.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:opacity-90 transition-opacity"
                                  >
                                    <h3 className="text-3xl xl:text-4xl font-bold mb-6 line-clamp-4 leading-tight hover:text-primary transition-colors">
                                      {article.title}
                                    </h3>
                                  </a>
                                  <p className="text-muted-foreground mb-8 line-clamp-4 text-lg xl:text-xl leading-relaxed">
                                    {article.description}
                                  </p>
                                  <a 
                                    href={article.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-block"
                                  >
                                    <Button 
                                      className="group hover:shadow-lg transition-all duration-300"
                                      size="lg"
                                    >
                                      Read Full Story
                                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation Controls */}
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/95 backdrop-blur-md hover:bg-background shadow-xl border-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  onClick={prevSlide}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/95 backdrop-blur-md hover:bg-background shadow-xl border-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  onClick={nextSlide}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>

                {/* Slide Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
                  {trendingNews.news.map((_, index) => (
                    <button
                      key={index}
                      className={`w-4 h-4 rounded-full transition-all duration-500 ${
                        index === currentSlide 
                          ? 'bg-primary scale-125 shadow-lg shadow-primary/50' 
                          : 'bg-primary/30 hover:bg-primary/60 hover:scale-110'
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </section>

        {/* Enhanced Search Section */}
        <div className="mb-12">
          <AdvancedSearch onSearch={handleSearch} isLoading={isLoadingLatest} />
        </div>

        {/* Enhanced News Grid Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                📰 {isSearchActive ? 'Search Results' : 'Latest News'}
              </h2>
              {hasResults && (
                <div className="hidden lg:block text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
                  {latestNews.news.length} articles found
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              disabled={isLoadingLatest}
              className="hover:shadow-lg transition-all duration-300"
              size="lg"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${isLoadingLatest ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          {isLoadingLatest ? (
            <LoadingSkeleton count={12} />
          ) : hasResults ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {latestNews.news.map((article) => (
                  <NewsCard 
                    key={article.id}
                    article={article} 
                    className="h-full hover:shadow-xl transition-shadow duration-300"
                  />
                ))}
              </div>
              
              <div className="mt-12 space-y-8">
                {/* Enhanced Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil((latestNews.count || latestNews.news.length) / 18)}
                  onPageChange={setCurrentPage}
                  className="justify-center"
                />
                
                {(searchFilters.query || searchFilters.category !== 'all') && (
                  <div className="text-center">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="hover:shadow-lg transition-all duration-300 mx-auto"
                      onClick={() => {
                        setSearchFilters({ query: '', category: 'all', sortBy: 'latest' });
                        setCurrentPage(1);
                      }}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Clear Search & Show All News
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-muted/30 rounded-2xl">
              <FileSearch className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium text-foreground">No articles found</h3>
              <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                {searchFilters.query || searchFilters.category !== 'all' 
                  ? 'Try different keywords or categories'
                  : 'Check back later for the latest updates'}
              </p>
              {(searchFilters.query || searchFilters.category !== 'all') && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchFilters({ query: '', category: 'all', sortBy: 'latest' });
                    setCurrentPage(1);
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;
