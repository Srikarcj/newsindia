
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink, Clock, User, Eye } from 'lucide-react';
import { NewsArticle } from '@/services/newsService';

interface NewsCardProps {
  article: NewsArticle;
  className?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, className = '' }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      business: 'bg-blue-500 hover:bg-blue-600',
      sports: 'bg-green-500 hover:bg-green-600',
      technology: 'bg-purple-500 hover:bg-purple-600',
      science: 'bg-orange-500 hover:bg-orange-600',
      health: 'bg-red-500 hover:bg-red-600',
      entertainment: 'bg-pink-500 hover:bg-pink-600',
      politics: 'bg-indigo-500 hover:bg-indigo-600',
      education: 'bg-teal-500 hover:bg-teal-600',
    };
    return colors[category?.toLowerCase()] || 'bg-gray-500 hover:bg-gray-600';
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only proceed if the click wasn't on an interactive element
    const target = e.target as HTMLElement;
    if (target.closest('a, button, [role="button"], input, select, textarea')) {
      return;
    }
    
    // Open article in new tab if URL exists and is valid
    if (article.url && article.url.startsWith('http')) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className={`group hover:shadow-xl transition-all duration-300 ${className}`}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && article.url) {
          e.preventDefault();
          window.open(article.url, '_blank', 'noopener,noreferrer');
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Read article: ${article.title}`}
    >
      <Card className="h-full">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={article.image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop'}
          alt={article.title}
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {article.category && article.category.length > 0 && (
          <Badge className={`absolute top-4 left-4 z-20 ${getCategoryColor(article.category[0])} text-white border-0 shadow-lg font-medium transition-all duration-300`}>
            {article.category[0]}
          </Badge>
        )}
        
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="flex items-center gap-1 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            {formatDate(article.published)}
          </div>
        </div>

        <div 
          className="absolute bottom-4 left-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Button
            asChild
            size="sm"
            className="w-full bg-white/95 text-black hover:bg-white shadow-lg backdrop-blur-sm"
          >
            <a 
              href={article.url.startsWith('http') ? article.url : `https://${article.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="w-4 h-4 mr-2" />
              Read Full Article
            </a>
          </Button>
        </div>
      </div>
      
      <CardContent 
        className="p-6 flex-1 flex flex-col" 
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          <a 
            href={article.url.startsWith('http') ? article.url : `https://${article.url}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hover:underline"
          >
            {article.title}
          </a>
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
          {article.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span className="font-medium truncate max-w-24">
              {article.author || 'Unknown'}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(article.published)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter 
        className="p-6 pt-0" 
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Button
          variant="outline"
          size="sm"
          asChild
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 hover:shadow-lg font-medium"
        >
          <a 
            href={article.url.startsWith('http') ? article.url : `https://${article.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            Read Full Article
          </a>
        </Button>
      </CardFooter>
      </Card>
    </div>
  );
};

export default NewsCard;
