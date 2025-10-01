import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useBudget() {
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBudget();
    }
  }, [user]);

  const fetchBudget = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("budgets")
        .select("amount")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      setBudget(data?.amount || 0);
    } catch (error) {
      console.error("Error fetching budget:", error);
      setBudget(0);
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = async (amount: number) => {
    if (!user) return false;

    try {
      // Check if user has existing budget
      const { data: existingBudget } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (existingBudget) {
        // Update existing budget
        const { error } = await supabase
          .from("budgets")
          .update({
            amount: Number(existingBudget.amount) + amount
          })
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Create new budget
        const { error } = await supabase
          .from("budgets")
          .insert({
            user_id: user.id,
            amount: amount
          });

        if (error) throw error;
      }

      await fetchBudget();
      return true;
    } catch (error) {
      console.error("Error updating budget:", error);
      return false;
    }
  };

  return {
    budget,
    loading,
    updateBudget,
    refreshBudget: fetchBudget
  };
}