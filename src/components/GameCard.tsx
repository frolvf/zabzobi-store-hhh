import { Link } from "react-router-dom";
import { Star, ShoppingCart, Check } from "lucide-react";
import { motion } from "framer-motion";
import type { Game } from "@/data/games";
import { useCart } from "@/contexts/CartContext";

const GameCard = ({ game, index = 0 }: { game: Game; index?: number }) => {
  const { addToCart, items } = useCart();
  const inCart = items.some((i) => i.game.id === game.id);
  const discount = game.originalPrice
    ? Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(190,95%,50%,0.15)]"
    >
      <Link to={`/product/${game.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-neon-green/90 text-background text-xs font-bold px-2 py-1 rounded-md">
              -{discount}%
            </span>
          )}

          <span className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-md text-foreground border border-border">
            {game.platform}
          </span>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${game.id}`}>
          <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {game.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-1.5">
          <Star className="w-3.5 h-3.5 fill-neon-cyan text-neon-cyan" />
          <span className="text-xs text-muted-foreground">{game.rating} ({game.reviews})</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">{game.price}</span>
            <span className="text-xs text-muted-foreground">MAD</span>
            {game.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">{game.originalPrice}</span>
            )}
          </div>

          <button
            onClick={() => !inCart && addToCart(game)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              inCart
                ? "bg-neon-green/20 text-neon-green"
                : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
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
