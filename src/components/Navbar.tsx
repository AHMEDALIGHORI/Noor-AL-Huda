import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Book, Sparkles, MessageSquare, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthContext } from '../AuthContext';
import { MagneticButton } from './MagneticButton';

const Navbar = () => {
  const { user } = React.useContext(AuthContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Stories', path: '/stories', icon: Book },
    { name: 'AI Chat', path: '/chat', icon: MessageSquare },
    { name: 'Science', path: '/science', icon: Sparkles },
    { name: 'Books', path: '/books', icon: Moon },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <MagneticButton>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-emerald-800 rounded-full flex items-center justify-center text-white shadow-lg">
                <Moon size={24} />
              </div>
              <span className="text-2xl font-serif font-bold text-emerald-900 tracking-tight">Noor Al-Huda</span>
            </Link>
          </MagneticButton>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <MagneticButton key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-emerald-700 ${
                    location.pathname === item.path ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-emerald-600'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              </MagneticButton>
            ))}
            {user ? (
              <MagneticButton>
                <Link to="/profile" className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 border border-emerald-200 block">
                  <User size={20} />
                </Link>
              </MagneticButton>
            ) : (
              <MagneticButton>
                <Link to="/login" className="btn-primary block">Sign In</Link>
              </MagneticButton>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-emerald-800">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-t border-emerald-100 p-4 space-y-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 text-lg font-medium text-emerald-700 p-2 rounded-lg hover:bg-emerald-50"
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            ))}
            {!user && (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center btn-primary">
                Sign In
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
