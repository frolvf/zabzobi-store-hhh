import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/AdminLayout";

const AdminUsers = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*, user_roles(role)")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  return (
    <AdminLayout>
      <p className="text-sm text-muted-foreground mb-6">{users?.length || 0} utilisateur(s)</p>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Chargement...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Nom</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Email</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Rôle</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id} className="border-t border-border hover:bg-surface/50">
                  <td className="px-4 py-3 text-foreground font-medium">{user.display_name || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {(user as any).user_roles?.map((r: any) => (
                      <span key={r.role} className={`text-xs px-2 py-0.5 rounded-full ${
                        r.role === "admin" ? "bg-primary/20 text-primary" : "bg-surface text-muted-foreground"
                      }`}>
                        {r.role}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {new Date(user.created_at).toLocaleDateString("fr")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
