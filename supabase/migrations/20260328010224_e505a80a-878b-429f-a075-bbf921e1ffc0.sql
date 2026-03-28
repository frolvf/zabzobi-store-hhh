
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(game_id, user_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert own review" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own review" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own review" ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all reviews" ON public.reviews FOR ALL USING (has_role(auth.uid(), 'admin'));
