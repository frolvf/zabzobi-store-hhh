import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Check, Zap, Shield, Package } from "lucide-react";
import { motion } from "framer-motion";
import { games } from "@/data/games";
import { useCart } from "@/contexts/CartContext";
import GameCard from "@/components/GameCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const game = games.find((g) => g.id === id);
  const { addToCart, items } = useCart();
  const inCart = game ? items.some((i) => i.game.id === game.id) : false;

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Produit non trouvé</h1>
          <Link to="/catalog" className="text-primary hover:underline">Retour au catalogue</Link>
        </div>
      </div>
    );
  }

  const related = games.filter((g) => g.platform === game.platform && g.id !== game.id).slice(0, 4);
  const discount = game.originalPrice
    ? Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100)
    : 0;

  const deliveryLabels: Record<string, string> = {
    account: "Compte complet",
    key: "Clé d'activation",
    instant: "Livraison instantanée",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 container mx-auto px-4">
        <Link to="/catalog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour au catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative rounded-2xl overflow-hidden aspect-[4/3]"
          >
            <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-neon-green/90 text-background text-sm font-bold px-3 py-1.5 rounded-lg">
                -{discount}%
              </span>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20">
                {game.platform}
              </span>
              <span className="bg-secondary/10 text-secondary text-xs font-semibold px-3 py-1 rounded-full border border-secondary/20">
                {game.category}
              </span>
            </div>

            <h1 className="font-display text-3xl font-bold text-foreground mb-3">{game.title}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(game.rating) ? "fill-neon-cyan text-neon-cyan" : "text-muted"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{game.rating} ({game.reviews} avis)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-display font-bold text-primary">{game.price}</span>
              <span className="text-lg text-muted-foreground">MAD</span>
              {game.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">{game.originalPrice} MAD</span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">{game.description}</p>

            {/* Meta */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Package, label: "Type", value: deliveryLabels[game.deliveryType] },
                { icon: Zap, label: "Livraison", value: "Instantanée" },
                { icon: Shield, label: "Stock", value: game.inStock ? "En stock" : "Épuisé" },
              ].map((m) => (
                <div key={m.label} className="p-3 rounded-xl bg-card border border-border text-center">
                  <m.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="text-xs font-semibold text-foreground">{m.value}</p>
                </div>
              ))}
            </div>

            {/* Buy button */}
            <button
              onClick={() => !inCart && addToCart(game)}
              disabled={!game.inStock}
              className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                inCart
                  ? "bg-neon-green/20 text-neon-green border border-neon-green/30"
                  : game.inStock
                  ? "bg-primary text-primary-foreground hover:shadow-[0_0_30px_hsl(190,95%,50%,0.4)]"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {inCart ? (
                <>
                  <Check className="w-5 h-5" /> Ajouté au panier
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" /> Ajouter au panier · {game.price} MAD
                </>
              )}
            </button>

            {/* Instructions */}
            <div className="mt-6 p-4 rounded-xl bg-card border border-border">
              <h3 className="font-semibold text-sm text-foreground mb-2">📋 Instructions</h3>
              <p className="text-sm text-muted-foreground">{game.instructions}</p>
            </div>
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Produits similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((g, i) => (
                <GameCard key={g.id} game={g} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
