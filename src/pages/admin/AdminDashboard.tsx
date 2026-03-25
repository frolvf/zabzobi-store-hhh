import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, Package, Users, TrendingUp } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [ordersRes, usersRes, gamesRes] = await Promise.all([
        supabase.from("orders").select("id, status, total_amount"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("games").select("id", { count: "exact", head: true }),
      ]);
      const orders = ordersRes.data || [];
      const totalRevenue = orders.filter(o => o.status === "delivered").reduce((s, o) => s + Number(o.total_amount), 0);
      const pendingOrders = orders.filter(o => o.status === "pending").length;
      const completedOrders = orders.filter(o => o.status === "delivered").length;
      return {
        totalRevenue,
        totalOrders: orders.length,
        pendingOrders,
        completedOrders,
        totalUsers: usersRes.count || 0,
        totalGames: gamesRes.count || 0,
      };
    },
  });

  const cards = [
    { title: "Revenu Total", value: `${stats?.totalRevenue || 0} MAD`, icon: DollarSign, color: "text-neon-green" },
    { title: "Commandes", value: stats?.totalOrders || 0, icon: Package, color: "text-primary" },
    { title: "En attente", value: stats?.pendingOrders || 0, icon: TrendingUp, color: "text-neon-pink" },
    { title: "Utilisateurs", value: stats?.totalUsers || 0, icon: Users, color: "text-secondary" },
  ];

  return (
    <AdminLayout>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.title} className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{card.title}</span>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders />
        <QuickStats stats={stats} />
      </div>
    </AdminLayout>
  );
};

const RecentOrders = () => {
  const { data: orders } = useQuery({
    queryKey: ["admin-recent-orders"],
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, profiles!orders_user_id_fkey(display_name, email)")
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/20 text-amber-400",
    verified: "bg-blue-500/20 text-blue-400",
    delivered: "bg-neon-green/20 text-neon-green",
    cancelled: "bg-destructive/20 text-destructive",
  };

  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <h3 className="font-display text-sm font-semibold text-foreground mb-4">Commandes récentes</h3>
      {!orders?.length ? (
        <p className="text-sm text-muted-foreground">Aucune commande</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{(order as any).profiles?.display_name || "Utilisateur"}</p>
                <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString("fr")}</p>
              </div>
              <div className="text-right flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{order.total_amount} MAD</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status] || ""}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const QuickStats = ({ stats }: { stats: any }) => (
  <div className="rounded-xl bg-card border border-border p-5">
    <h3 className="font-display text-sm font-semibold text-foreground mb-4">Aperçu rapide</h3>
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">Commandes livrées</span>
          <span className="text-foreground">{stats?.completedOrders || 0}/{stats?.totalOrders || 0}</span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-neon-green rounded-full transition-all"
            style={{ width: stats?.totalOrders ? `${(stats.completedOrders / stats.totalOrders) * 100}%` : "0%" }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-surface text-center">
          <p className="text-xl font-bold text-foreground">{stats?.totalGames || 0}</p>
          <p className="text-xs text-muted-foreground">Jeux</p>
        </div>
        <div className="p-3 rounded-lg bg-surface text-center">
          <p className="text-xl font-bold text-foreground">{stats?.totalUsers || 0}</p>
          <p className="text-xs text-muted-foreground">Utilisateurs</p>
        </div>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
