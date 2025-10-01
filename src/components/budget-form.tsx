import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Wallet } from "lucide-react";

interface BudgetFormProps {
  onClose: () => void;
  onBudgetUpdated: () => void;
  currentBudget?: number;
}

export default function BudgetForm({ onClose, onBudgetUpdated, currentBudget = 0 }: BudgetFormProps) {
  const [formState, setFormState] = useState({
    amount: "",
    isLoading: false
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to manage budget",
        variant: "destructive",
      });
      return;
    }

    if (!formState.amount) {
      toast({
        title: "Error",
        description: "Please enter an amount",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(formState.amount);
    if (amount <= 0) {
      toast({
        title: "Error",
        description: "Amount must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Check if user has existing budget
      const { data: existingBudget } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (existingBudget) {
        // Update existing budget by adding the amount
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

      toast({
        title: "Success",
        description: `Added ₹${amount.toFixed(2)} to your budget`,
      });

      onBudgetUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating budget:", error);
      toast({
        title: "Error",
        description: "Failed to update budget. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Add to Budget
        </CardTitle>
        <CardDescription>
          Add money to your budget. Current budget: ₹{currentBudget.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Add *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formState.amount}
                onChange={(e) => setFormState(prev => ({ ...prev, amount: e.target.value }))}
                disabled={formState.isLoading}
                className="pl-8"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={formState.isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={formState.isLoading}
              className="flex-1"
            >
              {formState.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Plus className="mr-2 h-4 w-4" />
              Add Budget
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}