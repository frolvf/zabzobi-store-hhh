import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Clock } from "lucide-react";
import { games } from "@/data/games";
import GameCard from "@/components/GameCard";
import HeroSlider from "@/components/HeroSlider";
import CategoryGrid from "@/components/CategoryGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const trending = games.filter((g) => g.trending);
const bestSellers = games.filter((g) => g.rating >= 4.7).slice(0, 4);

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-20">
      {/* Hero */}
      <section className="container mx-auto px-4 mb-12">
        <HeroSlider />
      </section>

      {/* Trust bar */}
      <section className="container mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Zap, title: "Livraison Instantanée", desc: "Recevez votre produit en quelques minutes" },
            { icon: Shield, title: "Paiement Sécurisé", desc: "WafaCash, CashPlus, Virement bancaire" },
            { icon: Clock, title: "Support 24/7", desc: "Assistance par WhatsApp et Telegram" },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="p-3 rounded-lg bg-primary/10">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 mb-12">
        <CategoryGrid />
      </section>

      {/* Trending */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">
            🔥 Tendances
          </h2>
          <Link to="/catalog" className="text-sm text-primary hover:underline flex items-center gap-1">
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trending.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">
            ⭐ Meilleures Ventes
          </h2>
          <Link to="/catalog" className="text-sm text-primary hover:underline flex items-center gap-1">
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bestSellers.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-4 mb-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 border border-primary/20 p-8 md:p-12">
          <div className="relative z-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              Rejoignez GameZone
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Créez votre compte et profitez de nos offres exclusives sur les jeux numériques au Maroc.
            </p>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:shadow-[0_0_20px_hsl(190,95%,50%,0.4)] transition-all"
            >
              Explorer le catalogue
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Index;
