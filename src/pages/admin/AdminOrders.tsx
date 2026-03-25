import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  verified: "bg-blue-500/20 text-blue-400",
  delivered: "bg-neon-green/20 text-neon-green",
  cancelled: "bg-destructive/20 text-destructive",
};

const statusOptions = ["pending", "verified", "delivered", "cancelled"];

const AdminOrders = () => {
  const qc = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, profiles!orders_user_id_fkey(display_name, email), order_items(*, games(title, platform))")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Statut mis à jour");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <AdminLayout>
      <p className="text-sm text-muted-foreground mb-6">{orders?.length || 0} commande(s)</p>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Chargement...</p>
      ) : !orders?.length ? (
        <p className="text-muted-foreground text-center py-12">Aucune commande</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl bg-card border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {(order as any).profiles?.display_name || "Utilisateur"}
                  </p>
                  <p className="text-xs text-muted-foreground">{(order as any).profiles?.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(order.created_at).toLocaleString("fr")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-display font-bold text-primary">{order.total_amount} MAD</p>
                  <p className="text-xs text-muted-foreground">{order.payment_method || "Non spécifié"}</p>
                </div>
              </div>

              {/* Items */}
              {(order as any).order_items?.length > 0 && (
                <div className="mb-4 space-y-2">
                  {(order as any).order_items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                      <span className="text-foreground">{item.games?.title} ({item.games?.platform})</span>
                      <span className="text-muted-foreground">{item.price} MAD × {item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Payment proof */}
              {order.payment_proof_url && (
                <div className="mb-4">
                  <a href={order.payment_proof_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                    📎 Voir preuve de paiement
                  </a>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Statut:</span>
                <div className="flex gap-2">
                  {statusOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus.mutate({ id: order.id, status: s })}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                        order.status === s
                          ? statusColors[s] + " border-current"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
