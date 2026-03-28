import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, Gamepad2, User, Shield, LogOut, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/catalog", label: "Catalogue" },
    { to: "/catalog?category=Accounts", label: "Comptes" },
    { to: "/catalog?category=Gift Cards", label: "Cartes Cadeaux" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Gamepad2 className="w-8 h-8 text-primary" />
          <span className="font-display text-xl font-bold text-primary text-glow-cyan">
            ZUOSS<span className="text-secondary"> SHOP</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to + link.label}
              to={link.to}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/catalog" className="p-2 rounded-lg hover:bg-surface transition-colors">
            <Search className="w-5 h-5 text-muted-foreground" />
          </Link>
          <Link to="/cart" className="relative p-2 rounded-lg hover:bg-surface transition-colors">
            <ShoppingCart className="w-5 h-5 text-muted-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-1">
              <Link to="/orders" className="p-2 rounded-lg hover:bg-surface transition-colors" title="Mes commandes">
                <Package className="w-5 h-5 text-muted-foreground" />
              </Link>
              {isAdmin && (
                <Link to="/admin" className="p-2 rounded-lg hover:bg-surface transition-colors" title="Admin">
                  <Shield className="w-5 h-5 text-secondary" />
                </Link>
              )}
              <button onClick={() => signOut()} className="p-2 rounded-lg hover:bg-surface transition-colors" title="Déconnexion">
                <LogOut className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
              <User className="w-4 h-4" />
              Connexion
            </Link>
          )}

          <button
            className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to + link.label}
                  to={link.to}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/orders" className="text-sm font-medium text-muted-foreground hover:text-primary py-2" onClick={() => setMobileOpen(false)}>
                    Mes Commandes
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="text-sm font-medium text-secondary py-2" onClick={() => setMobileOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="text-sm font-medium text-destructive py-2 text-left">
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link to="/auth" className="text-sm font-medium text-primary py-2" onClick={() => setMobileOpen(false)}>
                  Connexion / Inscription
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
