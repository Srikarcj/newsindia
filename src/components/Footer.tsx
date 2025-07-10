
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About NewsIndia</h3>
            <p className="text-muted-foreground text-sm">
              Your trusted source for the latest news from India. Stay updated with breaking news, 
              state-wise updates, and comprehensive coverage across all categories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Home
              </Link>
              <Link to="/states" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                All States
              </Link>
              <Link to="/categories" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Categories
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Disclaimer</h3>
            <p className="text-muted-foreground text-sm">
              News content is powered by Currents API. We are not responsible for the accuracy 
              of third-party content. All articles belong to their respective publishers.
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-4 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 NewsIndia. Built with React & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
