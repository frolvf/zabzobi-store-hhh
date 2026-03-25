import { Link } from "react-router-dom";
import { Star, ShoppingCart, Check } from "lucide-react";
import { motion } from "framer-motion";
import type { GameDB } from "@/hooks/useGames";
import type { Game } from "@/data/games";
import { useCart } from "@/contexts/CartContext";

type GameLike = GameDB | Game;

const isGameDB = (g: GameLike): g is GameDB => "image_url" in g;

const GameCard = ({ game, index = 0 }: { game: GameLike; index?: number }) => {
  const { addToCart, items } = useCart();

  const id = game.id;
  const title = game.title;
  const platform = game.platform;
  const price = Number(game.price);
  const originalPrice = isGameDB(game) ? (game.original_price ? Number(game.original_price) : undefined) : game.originalPrice;
  const image = isGameDB(game) ? (game.image_url || "/placeholder.svg") : game.image;
  const rating = isGameDB(game) ? (game.rating ?? 0) : game.rating;
  const reviews = isGameDB(game) ? (game.reviews_count ?? 0) : game.reviews;
  const inStock = isGameDB(game) ? game.in_stock : game.inStock;

  const inCart = items.some((i) => i.game.id === id);
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAdd = () => {
    if (inCart) return;
    // Create a normalized game object for the cart
    const normalized: Game = {
      id,
      title,
      platform: platform as any,
      category: isGameDB(game) ? ((game.categories?.name || "Accounts") as any) : game.category,
      price,
      originalPrice,
      currency: isGameDB(game) ? game.currency : "MAD",
      image,
      description: (isGameDB(game) ? game.description : game.description) || "",
      deliveryType: (isGameDB(game) ? game.delivery_type : game.deliveryType) as any,
      instructions: (isGameDB(game) ? game.instructions : game.instructions) || "",
      inStock: inStock,
      featured: isGameDB(game) ? game.featured : game.featured,
      trending: isGameDB(game) ? game.trending : game.trending,
      rating: Number(rating),
      reviews: Number(reviews),
    };
    addToCart(normalized);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(190,95%,50%,0.15)]"
    >
      <Link to={`/product/${id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-neon-green/90 text-background text-xs font-bold px-2 py-1 rounded-md">-{discount}%</span>
          )}
          <span className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-md text-foreground border border-border">{platform}</span>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">{title}</h3>
        </Link>
        <div className="flex items-center gap-1 mt-1.5">
          <Star className="w-3.5 h-3.5 fill-neon-cyan text-neon-cyan" />
          <span className="text-xs text-muted-foreground">{rating} ({reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">{price}</span>
            <span className="text-xs text-muted-foreground">MAD</span>
            {originalPrice && <span className="text-xs text-muted-foreground line-through">{originalPrice}</span>}
          </div>
          <button
            onClick={handleAdd}
            className={`p-2 rounded-lg transition-all duration-200 ${
              inCart ? "bg-neon-green/20 text-neon-green" : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;
