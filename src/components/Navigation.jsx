import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Ticket, Plus, Bell, Settings } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    if (path === '/tickets') {
      return location.pathname === '/tickets' || location.pathname.startsWith('/tickets/');
    }
    return location.pathname === path;
  };

  const navLinks = [
    {
      to: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      to: '/tickets',
      icon: Ticket,
      label: 'Tickets',
    },
  ];

  return (
    <nav 
      className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 group transition-transform hover:scale-105"
            >
              <div className="relative">
                <Ticket className="w-8 h-8 text-blue-600 transition-transform group-hover:rotate-12" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
              </div>
              <span className="text-xl font-extrabold text-blue-600">
                DigiServices
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200
                    ${active 
                      ? 'text-blue-600 bg-blue-50 shadow-sm' 
                      : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 transition-transform ${active ? 'scale-110' : ''}`} />
                  <span>{link.label}</span>
                  {active && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full" />
                  )}
                </Link>
              );
            })}

          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 transition-transform rotate-90" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`
          md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="bg-slate-50 border-t border-slate-200">
          <div className="px-4 pt-3 pb-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all
                    ${active 
                      ? 'text-blue-600 bg-white shadow-sm' 
                      : 'text-slate-700 hover:text-blue-600 hover:bg-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                  {active && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;