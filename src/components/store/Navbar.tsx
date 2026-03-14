import { ShoppingBag, Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';

const Navbar = ({ onCartOpen }: { onCartOpen: () => void }) => {
  const { settings, cartCount, isAdmin } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex flex-col min-w-0">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
            {settings.name}
          </h1>
          <p className="text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-widest font-semibold truncate">
            {settings.address}
          </p>
        </Link>

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            to="/"
            className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
              location.pathname === '/' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Shop
          </Link>
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                location.pathname.startsWith('/admin') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Shield className="w-4 h-4" /> Dashboard
            </Link>
          )}
          {!isAdmin && (
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Admin
            </Link>
          )}
          <button onClick={onCartOpen} className="relative p-2 hover:bg-accent rounded-full transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-card">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile actions */}
        <div className="flex sm:hidden items-center gap-2">
          <button onClick={onCartOpen} className="relative p-2 hover:bg-accent rounded-full transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-card">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 hover:bg-accent rounded-full transition-colors">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-border bg-card animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors">Shop</Link>
            {isAdmin ? (
              <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> Dashboard
              </Link>
            ) : (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors">Admin Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
