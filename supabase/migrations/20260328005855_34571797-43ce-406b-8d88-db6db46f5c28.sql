
CREATE TABLE public.promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_percent integer NOT NULL DEFAULT 0,
  discount_amount numeric NOT NULL DEFAULT 0,
  min_order_amount numeric NOT NULL DEFAULT 0,
  max_uses integer DEFAULT NULL,
  used_count integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamp with time zone DEFAULT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage promo codes" ON public.promo_codes FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users can view active promo codes" ON public.promo_codes FOR SELECT TO authenticated USING (is_active = true);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS promo_code text DEFAULT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0;
