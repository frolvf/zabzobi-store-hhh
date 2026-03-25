import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Check, Zap, Shield, Package } from "lucide-react";
import { motion } from "framer-motion";
import { games as mockGames } from "@/data/games";
import { useGame, useGames } from "@/hooks/useGames";
import { useCart } from "@/contexts/CartContext";
import GameCard from "@/components/GameCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Game } from "@/data/games";

const ProductDetail = () => {
  const { id } = useParams();
  const { data: dbGame, isLoading } = useGame(id || "");
  const { data: dbGames } = useGames();
  const { addToCart, items } = useCart();

  // Fallback to mock data
  const mockGame = mockGames.find((g) => g.id === id);
  const isDB = !!dbGame;

  const title = isDB ? dbGame.title : mockGame?.title;
  const platform = isDB ? dbGame.platform : mockGame?.platform;
  const price = isDB ? Number(dbGame.price) : mockGame?.price;
  const originalPrice = isDB ? (dbGame.original_price ? Number(dbGame.original_price) : undefined) : mockGame?.originalPrice;
  const image = isDB ? (dbGame.image_url || "/placeholder.svg") : mockGame?.image;
  const description = isDB ? dbGame.description : mockGame?.description;
  const deliveryType = isDB ? dbGame.delivery_type : mockGame?.deliveryType;
  const instructions = isDB ? dbGame.instructions : mockGame?.instructions;
  const inStock = isDB ? dbGame.in_stock : mockGame?.inStock;
  const rating = isDB ? Number(dbGame.rating || 0) : (mockGame?.rating || 0);
  const reviews = isDB ? Number(dbGame.reviews_count || 0) : (mockGame?.reviews || 0);
  const category = isDB ? (dbGame.categories?.name || "") : (mockGame?.category || "");

  const gameFound = isDB || !!mockGame;
  const inCart = id ? items.some((i) => i.game.id === id) : false;
  const discount = originalPrice && price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  if (isLoading) {
    return <div className="min-h-screen bg-background"><Navbar /><main className="pt-24 container mx-auto px-4 text-center text-muted-foreground">Chargement...</main></div>;
  }

  if (!gameFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Produit non trouvé</h1>
          <Link to="/catalog" className="text-primary hover:underline">Retour au catalogue</Link>
        </div>
      </div>
    );
  }

  const allGames = dbGames?.length ? dbGames : mockGames;
  const related = allGames.filter((g: any) => g.platform === platform && g.id !== id).slice(0, 4);

  const deliveryLabels: Record<string, string> = { account: "Compte complet", key: "Clé d'activation", instant: "Livraison instantanée" };

  const handleAdd = () => {
    if (inCart || !id) return;
    const normalized: Game = {
      id: id!, title: title!, platform: platform as any, category: category as any,
      price: price!, originalPrice, currency: "MAD", image: image!, description: description || "",
      deliveryType: deliveryType as any, instructions: instructions || "",
      inStock: inStock!, featured: false, trending: false, rating, reviews,
    };
    addToCart(normalized);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 container mx-auto px-4">
        <Link to="/catalog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour au catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative rounded-2xl overflow-hidden aspect-[4/3]">
            <img src={image} alt={title} className="w-full h-full object-cover" />
            {discount > 0 && <span className="absolute top-4 left-4 bg-neon-green/90 text-background text-sm font-bold px-3 py-1.5 rounded-lg">-{discount}%</span>}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20">{platform}</span>
              {category && <span className="bg-secondary/10 text-secondary text-xs font-semibold px-3 py-1 rounded-full border border-secondary/20">{category}</span>}
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-3">{title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-neon-cyan text-neon-cyan" : "text-muted"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{rating} ({reviews} avis)</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-display font-bold text-primary">{price}</span>
              <span className="text-lg text-muted-foreground">MAD</span>
              {originalPrice && <span className="text-lg text-muted-foreground line-through">{originalPrice} MAD</span>}
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">{description}</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Package, label: "Type", value: deliveryLabels[deliveryType || "account"] },
                { icon: Zap, label: "Livraison", value: "Instantanée" },
                { icon: Shield, label: "Stock", value: inStock ? "En stock" : "Épuisé" },
              ].map((m) => (
                <div key={m.label} className="p-3 rounded-xl bg-card border border-border text-center">
                  <m.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="text-xs font-semibold text-foreground">{m.value}</p>
                </div>
              ))}
            </div>
            <button onClick={handleAdd} disabled={!inStock}
              className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                inCart ? "bg-neon-green/20 text-neon-green border border-neon-green/30"
                  : inStock ? "bg-primary text-primary-foreground hover:shadow-[0_0_30px_hsl(190,95%,50%,0.4)]"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}>
              {inCart ? <><Check className="w-5 h-5" /> Ajouté au panier</> : <><ShoppingCart className="w-5 h-5" /> Ajouter au panier · {price} MAD</>}
            </button>
            {instructions && (
              <div className="mt-6 p-4 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-sm text-foreground mb-2">📋 Instructions</h3>
                <p className="text-sm text-muted-foreground">{instructions}</p>
              </div>
            )}
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Produits similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((g, i) => <GameCard key={g.id} game={g} index={i} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
