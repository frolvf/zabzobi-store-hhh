import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { games } from "@/data/games";

const featured = games.filter((g) => g.featured).slice(0, 4);

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % featured.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const game = featured[current];

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={game.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            key={game.id + "-text"}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-lg"
          >
            <span className="inline-block bg-primary/20 text-primary text-xs font-display font-semibold px-3 py-1 rounded-full border border-primary/30 mb-4">
              {game.platform} • {game.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3 leading-tight">
              {game.title}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2">
              {game.description}
            </p>
            <div className="flex items-center gap-4">
              <Link
                to={`/product/${game.id}`}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_hsl(190,95%,50%,0.4)] transition-all duration-300"
              >
                Acheter · {game.price} MAD
                <ArrowRight className="w-4 h-4" />
              </Link>
              {game.originalPrice && (
                <span className="text-muted-foreground line-through text-sm">{game.originalPrice} MAD</span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2">
        <button
          onClick={() => setCurrent((c) => (c - 1 + featured.length) % featured.length)}
          className="p-2 rounded-lg glass hover:bg-surface-hover transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-1.5 mx-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-primary" : "w-1.5 bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrent((c) => (c + 1) % featured.length)}
          className="p-2 rounded-lg glass hover:bg-surface-hover transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default HeroSlider;
