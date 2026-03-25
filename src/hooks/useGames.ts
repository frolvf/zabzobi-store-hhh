import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface GameDB {
  id: string;
  title: string;
  platform: string;
  category_id: string | null;
  price: number;
  original_price: number | null;
  currency: string;
  image_url: string | null;
  description: string | null;
  delivery_type: string;
  instructions: string | null;
  in_stock: boolean;
  featured: boolean;
  trending: boolean;
  rating: number | null;
  reviews_count: number | null;
  categories?: { name: string } | null;
}

export const useGames = () =>
  useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as GameDB[];
    },
  });

export const useGame = (id: string) =>
  useQuery({
    queryKey: ["game", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("*, categories(name)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as GameDB | null;
    },
    enabled: !!id,
  });

export const useFeaturedGames = () =>
  useQuery({
    queryKey: ["featured-games"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("*, categories(name)")
        .eq("featured", true)
        .limit(6);
      if (error) throw error;
      return (data || []) as GameDB[];
    },
  });

export const useTrendingGames = () =>
  useQuery({
    queryKey: ["trending-games"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("*, categories(name)")
        .eq("trending", true)
        .limit(8);
      if (error) throw error;
      return (data || []) as GameDB[];
    },
  });
