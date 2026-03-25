import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { toast } from "sonner";

interface GameForm {
  title: string;
  platform: string;
  price: string;
  original_price: string;
  description: string;
  delivery_type: string;
  instructions: string;
  image_url: string;
  featured: boolean;
  trending: boolean;
  in_stock: boolean;
  category_id: string;
}

const empty: GameForm = {
  title: "", platform: "Steam", price: "", original_price: "", description: "",
  delivery_type: "account", instructions: "", image_url: "", featured: false,
  trending: false, in_stock: true, category_id: "",
};

const AdminGames = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<GameForm>(empty);

  const { data: games, isLoading } = useQuery({
    queryKey: ["admin-games"],
    queryFn: async () => {
      const { data } = await supabase.from("games").select("*, categories(name)").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*");
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        platform: form.platform,
        price: parseFloat(form.price),
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        description: form.description,
        delivery_type: form.delivery_type,
        instructions: form.instructions,
        image_url: form.image_url,
        featured: form.featured,
        trending: form.trending,
        in_stock: form.in_stock,
        category_id: form.category_id || null,
      };
      if (editingId) {
        const { error } = await supabase.from("games").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("games").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-games"] });
      setShowForm(false);
      setEditingId(null);
      setForm(empty);
      toast.success(editingId ? "Jeu modifié" : "Jeu ajouté");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("games").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-games"] });
      toast.success("Jeu supprimé");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const startEdit = (game: any) => {
    setForm({
      title: game.title, platform: game.platform, price: String(game.price),
      original_price: game.original_price ? String(game.original_price) : "",
      description: game.description || "", delivery_type: game.delivery_type,
      instructions: game.instructions || "", image_url: game.image_url || "",
      featured: game.featured, trending: game.trending, in_stock: game.in_stock,
      category_id: game.category_id || "",
    });
    setEditingId(game.id);
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{games?.length || 0} jeux</p>
        <button
          onClick={() => { setForm(empty); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-[0_0_20px_hsl(190,95%,50%,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" /> Ajouter un jeu
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-semibold">{editingId ? "Modifier" : "Nouveau jeu"}</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Titre" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="px-3 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})} className="px-3 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              {["Steam","PS4","PS5","Xbox","Epic Games","Nintendo"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input placeholder="Prix (MAD)" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="px-3 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <input placeholder="Ancien prix (optionnel)" type="number" value={form.original_price} onChange={e => setForm({...form, original_price: e.target.value})} className="px-3 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <select value={form.delivery_type} onChange={e => setForm({...form, delivery_type: e.target.value})} className="px-3 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="account">Compte</option>
              <option value="key">Clé</option>
              <option value="instant">Instantané</option>
            </select>
            <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="px-3 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="">Catégorie...</option>
              {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="URL de l'image" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="px-3 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 md:col-span-2" />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="px-3 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 md:col-span-2" />
            <textarea placeholder="Instructions" value={form.instructions} onChange={e => setForm({...form, instructions: e.target.value})} rows={2} className="px-3 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 md:col-span-2" />
            <div className="flex items-center gap-6 md:col-span-2">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="accent-primary" /> Mis en avant
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" checked={form.trending} onChange={e => setForm({...form, trending: e.target.checked})} className="accent-primary" /> Tendance
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" checked={form.in_stock} onChange={e => setForm({...form, in_stock: e.target.checked})} className="accent-primary" /> En stock
              </label>
            </div>
          </div>
          <button
            onClick={() => saveMutation.mutate()}
            disabled={!form.title || !form.price || saveMutation.isPending}
            className="mt-4 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
          >
            {saveMutation.isPending ? "Enregistrement..." : editingId ? "Modifier" : "Ajouter"}
          </button>
        </div>
      )}

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Chargement...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Jeu</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Plateforme</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Prix</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">Stock</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {games?.map((game) => (
                <tr key={game.id} className="border-t border-border hover:bg-surface/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {game.image_url && <img src={game.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                      <span className="text-foreground font-medium line-clamp-1">{game.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{game.platform}</td>
                  <td className="px-4 py-3 text-foreground font-semibold">{game.price} MAD</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${game.in_stock ? "bg-neon-green/20 text-neon-green" : "bg-destructive/20 text-destructive"}`}>
                      {game.in_stock ? "En stock" : "Épuisé"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => startEdit(game)} className="p-1.5 text-muted-foreground hover:text-primary"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => { if (confirm("Supprimer ?")) deleteMutation.mutate(game.id); }} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
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

export default AdminGames;
