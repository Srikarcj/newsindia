
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';

const NEWS_CATEGORIES = [
  {
    name: 'Business',
    slug: 'business',
    description: 'Market updates, economic developments, startup news, and financial insights',
    icon: '💼',
    color: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-500/10 to-blue-600/5'
  },
  {
    name: 'Sports',
    slug: 'sports',
    description: 'Cricket, football, tennis, Olympics, and comprehensive sports coverage',
    icon: '⚽',
    color: 'from-green-500 to-green-600',
    bgGradient: 'from-green-500/10 to-green-600/5'
  },
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Tech innovations, AI developments, startup ecosystem, and digital trends',
    icon: '💻',
    color: 'from-purple-500 to-purple-600',
    bgGradient: 'from-purple-500/10 to-purple-600/5'
  },
  {
    name: 'Science',
    slug: 'science',
    description: 'Research breakthroughs, space missions, environmental studies, and discoveries',
    icon: '🔬',
    color: 'from-orange-500 to-orange-600',
    bgGradient: 'from-orange-500/10 to-orange-600/5'
  },
  {
    name: 'Health',
    slug: 'health',
    description: 'Medical breakthroughs, wellness tips, healthcare policies, and public health',
    icon: '🏥',
    color: 'from-red-500 to-red-600',
    bgGradient: 'from-red-500/10 to-red-600/5'
  },
  {
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Bollywood, regional cinema, music, celebrities, and cultural events',
    icon: '🎬',
    color: 'from-pink-500 to-pink-600',
    bgGradient: 'from-pink-500/10 to-pink-600/5'
  },
  {
    name: 'Politics',
    slug: 'politics',
    description: 'Government updates, policy changes, electoral news, and political analysis',
    icon: '🏛️',
    color: 'from-indigo-500 to-indigo-600',
    bgGradient: 'from-indigo-500/10 to-indigo-600/5'
  },
  {
    name: 'Education',
    slug: 'education',
    description: 'Academic reforms, educational technology, career guidance, and learning resources',
    icon: '📚',
    color: 'from-teal-500 to-teal-600',
    bgGradient: 'from-teal-500/10 to-teal-600/5'
  }
];

const Categories = () => {


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="text-center mb-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="relative">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                  News Categories
                </h1>
                <Sparkles className="w-8 h-8 text-primary animate-pulse delay-500" />
              </div>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Browse news by category to discover exactly what interests you most
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {NEWS_CATEGORIES.map((category, index) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden border-0 shadow-lg hover:shadow-primary/20">
                <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-50 group-hover:opacity-80 transition-all duration-500`} />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                
                <CardHeader className="text-center pb-4 relative z-10">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300 font-bold">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="text-center relative z-10">
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {category.description}
                  </p>
                  <div className="text-sm text-primary font-semibold group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center gap-2">
                    Explore {category.name} News
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-muted/30 to-muted/10 border-0 shadow-xl">
            <CardContent className="p-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
                <h3 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Stay Informed, Stay Ahead
                </h3>
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
                Our categorized news sections help you stay updated on topics that matter most to you. 
                Each category is carefully curated to bring you the most relevant, timely, and comprehensive news coverage from across India.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Categories;
