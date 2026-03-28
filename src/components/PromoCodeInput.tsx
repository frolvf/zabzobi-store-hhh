import { useState } from "react";
import { Tag, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PromoCodeInputProps {
  subtotal: number;
  onApply: (code: string, discount: number) => void;
  onRemove: () => void;
  appliedCode: string | null;
  discount: number;
}

const PromoCodeInput = ({ subtotal, onApply, onRemove, appliedCode, discount }: PromoCodeInputProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", trimmed)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast.error("Code promo invalide");
        return;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        toast.error("Ce code promo a expiré");
        return;
      }
      if (data.max_uses && data.used_count >= data.max_uses) {
        toast.error("Ce code promo n'est plus disponible");
        return;
      }
      if (subtotal < (data.min_order_amount ?? 0)) {
        toast.error(`Montant minimum requis: ${data.min_order_amount} MAD`);
        return;
      }

      let discountAmount = 0;
      if (data.discount_percent > 0) {
        discountAmount = Math.round(subtotal * data.discount_percent / 100);
      }
      if (data.discount_amount > 0) {
        discountAmount = Math.max(discountAmount, Number(data.discount_amount));
      }
      discountAmount = Math.min(discountAmount, subtotal);

      onApply(trimmed, discountAmount);
      toast.success(`Code promo appliqué ! -${discountAmount} MAD`);
    } catch {
      toast.error("Erreur lors de la vérification");
    } finally {
      setLoading(false);
    }
  };

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-green-400">{appliedCode}</span>
          <span className="text-xs text-green-400/70">(-{discount} MAD)</span>
        </div>
        <button onClick={onRemove} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Code promo"
          maxLength={30}
          className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
        />
      </div>
      <button
        onClick={handleApply}
        disabled={loading || !code.trim()}
        className="px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 disabled:opacity-50 flex items-center gap-1.5"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Appliquer"}
      </button>
    </div>
  );
};

export default PromoCodeInput;
