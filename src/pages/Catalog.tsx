import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { games as mockGames, platforms, categories } from "@/data/games";
import { useGames } from "@/hooks/useGames";
import GameCard from "@/components/GameCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const activePlatform = searchParams.get("platform") || "";
  const activeCategory = searchParams.get("category") || "";
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const { data: dbGames } = useGames();
  const allGames = dbGames?.length ? dbGames : mockGames;

  const filtered = useMemo(() => {
    return allGames.filter((g: any) => {
      if (search && !g.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (activePlatform && g.platform !== activePlatform) return false;
      if (activeCategory) {
        const catName = "categories" in g ? g.categories?.name : g.category;
        if (catName !== activeCategory) return false;
      }
      if (Number(g.price) < priceRange[0] || Number(g.price) > priceRange[1]) return false;
      return true;
    });
  }, [allGames, search, activePlatform, activeCategory, priceRange]);

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    setSearchParams(params);
  };

  const clearFilters = () => { setSearchParams({}); setSearch(""); setPriceRange([0, 1000]); };
  const hasFilters = activePlatform || activeCategory || search;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 container mx-auto px-4">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Catalogue</h1>
        <p className="text-muted-foreground mb-8">Découvrez nos jeux et produits numériques</p>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input type="text" placeholder="Rechercher un jeu..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl border transition-colors flex items-center gap-2 ${showFilters ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}>
            <SlidersHorizontal className="w-5 h-5" /><span className="hidden sm:inline text-sm">Filtres</span>
          </button>
        </div>

        {showFilters && (
          <div className="mb-8 p-6 rounded-xl bg-card border border-border space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Plateforme</h3>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <button key={p} onClick={() => setFilter("platform", activePlatform === p ? "" : p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activePlatform === p ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground hover:text-foreground"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Catégorie</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button key={c} onClick={() => setFilter("category", activeCategory === c ? "" : c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeCategory === c ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground hover:text-foreground"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Prix: {priceRange[0]} - {priceRange[1]} MAD</h3>
              <input type="range" min={0} max={1000} step={50} value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-full accent-primary" />
            </div>
            {hasFilters && (
              <button onClick={clearFilters} className="text-sm text-destructive hover:underline flex items-center gap-1"><X className="w-4 h-4" /> Effacer les filtres</button>
            )}
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-4">{filtered.length} résultat(s)</p>
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-2">Aucun produit trouvé</p>
            <button onClick={clearFilters} className="text-primary hover:underline text-sm">Réinitialiser les filtres</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((game, i) => <GameCard key={game.id} game={game} index={i} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;
