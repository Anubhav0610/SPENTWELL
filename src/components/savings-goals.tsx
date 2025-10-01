import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { format, differenceInMonths, startOfMonth, endOfMonth } from "date-fns";
import { CalendarIcon, Target, Plus, Loader2, DollarSign, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SavingsGoal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  created_at: string;
}

interface SavingsGoalsProps {
  totalExpenses: number;
  currentBudget: number;
}

export default function SavingsGoals({ totalExpenses, currentBudget }: SavingsGoalsProps) {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    targetAmount: "",
    targetDate: new Date(),
    isLoading: false
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("savings_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast({
        title: "Error",
        description: "Failed to fetch savings goals",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create goals",
        variant: "destructive",
      });
      return;
    }

    if (!formState.title || !formState.targetAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const targetAmount = parseFloat(formState.targetAmount);
    if (targetAmount <= 0) {
      toast({
        title: "Error",
        description: "Target amount must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { error } = await supabase
        .from("savings_goals")
        .insert({
          user_id: user.id,
          title: formState.title,
          target_amount: targetAmount,
          current_amount: 0,
          target_date: format(formState.targetDate, "yyyy-MM-dd")
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Savings goal created successfully!",
      });

      setFormState({
        title: "",
        targetAmount: "",
        targetDate: new Date(),
        isLoading: false
      });
      setShowForm(false);
      fetchGoals();
    } catch (error) {
      console.error("Error creating goal:", error);
      toast({
        title: "Error",
        description: "Failed to create savings goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const calculateMonthlySavingsNeeded = (goal: SavingsGoal) => {
    const monthsRemaining = differenceInMonths(new Date(goal.target_date), new Date());
    if (monthsRemaining <= 0) return goal.target_amount - goal.current_amount;
    
    const remainingAmount = goal.target_amount - goal.current_amount;
    return remainingAmount / monthsRemaining;
  };

  const calculateMonthlySpendingLimit = (goal: SavingsGoal) => {
    const monthlySavingsNeeded = calculateMonthlySavingsNeeded(goal);
    const monthlySpendingLimit = currentBudget - monthlySavingsNeeded;
    return Math.max(0, monthlySpendingLimit);
  };

  const getProgressPercentage = (goal: SavingsGoal) => {
    return Math.min(100, (goal.current_amount / goal.target_amount) * 100);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Savings Goals
              </CardTitle>
              <CardDescription>
                Set financial targets and track your progress
              </CardDescription>
            </div>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Savings Goal</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Goal Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Emergency Fund, Vacation, New Car"
                      value={formState.title}
                      onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
                      disabled={formState.isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetAmount">Target Amount *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="targetAmount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formState.targetAmount}
                        onChange={(e) => setFormState(prev => ({ ...prev, targetAmount: e.target.value }))}
                        disabled={formState.isLoading}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Target Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formState.targetDate && "text-muted-foreground"
                          )}
                          disabled={formState.isLoading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formState.targetDate ? format(formState.targetDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formState.targetDate}
                          onSelect={(date) => date && setFormState(prev => ({ ...prev, targetDate: date }))}
                          initialFocus
                          disabled={(date) => date <= new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowForm(false)}
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
                      Create Goal
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No savings goals yet. Create your first goal to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const progress = getProgressPercentage(goal);
                const monthsRemaining = Math.max(0, differenceInMonths(new Date(goal.target_date), new Date()));
                const monthlySavingsNeeded = calculateMonthlySavingsNeeded(goal);
                const monthlySpendingLimit = calculateMonthlySpendingLimit(goal);
                
                return (
                  <Card key={goal.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{goal.title}</h3>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(goal.target_date), "MMM yyyy")}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>₹{goal.current_amount.toFixed(2)} / ₹{goal.target_amount.toFixed(2)}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {progress.toFixed(1)}% complete
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span className="font-medium">Monthly Savings Needed</span>
                          </div>
                          <div className="text-lg font-semibold text-primary">
                            ₹{monthlySavingsNeeded.toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span className="font-medium">Monthly Spending Limit</span>
                          </div>
                          <div className={`text-lg font-semibold ${monthlySpendingLimit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₹{monthlySpendingLimit.toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            <span className="font-medium">Months Remaining</span>
                          </div>
                          <div className="text-lg font-semibold">
                            {monthsRemaining} month{monthsRemaining !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>

                      {monthlySpendingLimit <= 0 && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <p className="text-sm text-destructive">
                            ⚠️ Your current budget is insufficient to reach this goal. Consider increasing your budget or extending the deadline.
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}