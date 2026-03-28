import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const ReviewSection = ({ gameId }: { gameId: string }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles(display_name)")
        .eq("game_id", gameId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const submitReview = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("reviews").insert({
        game_id: gameId,
        user_id: user!.id,
        rating,
        comment: comment.trim() || null,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", gameId] });
      setShowForm(false);
      setComment("");
      setRating(5);
      toast.success("Avis publié !");
    },
    onError: (err: any) => {
      if (err.message?.includes("unique") || err.code === "23505") {
        toast.error("Vous avez déjà laissé un avis pour ce produit");
      } else {
        toast.error(err.message || "Erreur");
      }
    },
  });

  const avgRating = reviews?.length
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <section className="mt-12 mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">{t("reviews.title")}</h2>
          {reviews && reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(Number(avgRating)) ? "fill-neon-cyan text-neon-cyan" : "text-muted"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{avgRating} ({reviews.length} {t("product.reviews")})</span>
            </div>
          )}
        </div>
        {user && !showForm && (
          <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
            {t("reviews.writeReview")}
          </button>
        )}
        {!user && (
          <p className="text-sm text-muted-foreground">{t("reviews.loginToReview")}</p>
        )}
      </div>

      {showForm && (
        <div className="mb-6 p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(s)}
              >
                <Star className={`w-6 h-6 transition-colors ${s <= (hoverRating || rating) ? "fill-neon-cyan text-neon-cyan" : "text-muted"}`} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t("reviews.placeholder")}
            maxLength={500}
            className="w-full h-24 rounded-lg bg-background border border-border p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={() => submitReview.mutate()}
              disabled={submitReview.isPending}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {submitReview.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("reviews.submitReview")}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground">
              ✕
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-muted-foreground text-sm">...</div>
      ) : !reviews?.length ? (
        <p className="text-muted-foreground text-sm py-8 text-center">{t("reviews.noReviews")}</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <div key={review.id} className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                    {(review.profiles?.display_name || "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{review.profiles?.display_name || "Utilisateur"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-neon-cyan text-neon-cyan" : "text-muted"}`} />
                  ))}
                </div>
              </div>
              {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewSection;
