import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Monitor, Gamepad, Joystick, Gift, Tv, CreditCard } from "lucide-react";

const categoryData = [
  { name: "Steam", icon: Monitor, color: "from-blue-500/20 to-blue-600/10", borderColor: "border-blue-500/30", query: "platform=Steam" },
  { name: "PS4 / PS5", icon: Gamepad, color: "from-blue-400/20 to-indigo-500/10", borderColor: "border-blue-400/30", query: "platform=PS5" },
  { name: "Xbox", icon: Joystick, color: "from-green-500/20 to-green-600/10", borderColor: "border-green-500/30", query: "platform=Xbox" },
  { name: "Epic Games", icon: Monitor, color: "from-slate-400/20 to-slate-500/10", borderColor: "border-slate-400/30", query: "platform=Epic Games" },
  { name: "Cartes Cadeaux", icon: Gift, color: "from-amber-400/20 to-amber-500/10", borderColor: "border-amber-400/30", query: "category=Gift Cards" },
  { name: "IPTV", icon: Tv, color: "from-purple-400/20 to-purple-500/10", borderColor: "border-purple-400/30", query: "category=IPTV" },
  { name: "Abonnements", icon: CreditCard, color: "from-cyan-400/20 to-cyan-500/10", borderColor: "border-cyan-400/30", query: "category=Subscriptions" },
];

const CategoryGrid = () => (
  <section>
    <h2 className="font-display text-2xl font-bold text-foreground mb-6">
      Catégories
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {categoryData.map((cat, i) => (
        <motion.div
          key={cat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <Link
            to={`/catalog?${cat.query}`}
            className={`flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-b ${cat.color} border ${cat.borderColor} hover:scale-105 transition-all duration-200`}
          >
            <cat.icon className="w-8 h-8 text-foreground" />
            <span className="text-xs font-medium text-foreground text-center">{cat.name}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  </section>
);

export default CategoryGrid;
