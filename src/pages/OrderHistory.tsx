import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, XCircle, Truck, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  pending: { label: "En attente", icon: Clock, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  confirmed: { label: "Confirmée", icon: CheckCircle, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  delivered: { label: "Livrée", icon: Truck, color: "bg-green-500/20 text-green-400 border-green-500/30" },
  cancelled: { label: "Annulée", icon: XCircle, color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const OrderHistory = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["user-orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, games(title, image_url, platform))")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12 container mx-auto px-4">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        <h1 className="font-display text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
          <Package className="w-8 h-8 text-primary" /> Mes Commandes
        </h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : !orders?.length ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Aucune commande pour le moment</p>
            <button onClick={() => navigate("/catalog")} className="mt-4 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold">
              Découvrir le catalogue
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Commande du {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">#{order.id.slice(0, 8)}</p>
                    </div>
                    <Badge variant="outline" className={`${status.color} flex items-center gap-1.5 px-3 py-1`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {(order as any).order_items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3">
                        {item.games?.image_url && (
                          <img src={item.games.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.games?.title || "Produit"}</p>
                          <p className="text-xs text-muted-foreground">{item.games?.platform} · Qté: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-foreground whitespace-nowrap">{item.price} MAD</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {order.payment_method && <span>Paiement: {order.payment_method}</span>}
                      {order.promo_code && <span className="ml-3">Code: {order.promo_code}</span>}
                    </div>
                    <div className="text-right">
                      {(order.discount_amount ?? 0) > 0 && (
                        <p className="text-xs text-green-400">-{order.discount_amount} MAD</p>
                      )}
                      <p className="text-lg font-bold text-primary">{order.total_amount} MAD</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrderHistory;
