import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cart = () => {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 container mx-auto px-4">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Panier</h1>
        <p className="text-muted-foreground mb-8">{items.length} article(s)</p>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Votre panier est vide</h2>
            <p className="text-muted-foreground mb-6">Explorez notre catalogue pour trouver vos jeux préférés.</p>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" /> Explorer le catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => (
                <motion.div
                  key={item.game.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-4 p-4 rounded-xl bg-card border border-border"
                >
                  <img
                    src={item.game.image}
                    alt={item.game.title}
                    className="w-24 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.game.id}`} className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-1">
                      {item.game.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.game.platform} · {item.game.category}</p>
                    <p className="text-lg font-bold text-primary mt-2">{item.game.price} MAD</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.game.id)}
                    className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 rounded-xl bg-card border border-border">
                <h2 className="font-display text-lg font-bold text-foreground mb-4">Résumé</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="text-foreground">{totalPrice} MAD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frais</span>
                    <span className="text-neon-green font-semibold">Gratuit</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-primary">{totalPrice} MAD</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-[0_0_30px_hsl(190,95%,50%,0.4)] transition-all mb-3"
                >
                  Commander
                </button>

                <p className="text-xs text-muted-foreground text-center mb-4">
                  Paiement par WafaCash, CashPlus ou virement bancaire
                </p>

                <button
                  onClick={clearCart}
                  className="w-full py-2 text-sm text-destructive hover:underline"
                >
                  Vider le panier
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
