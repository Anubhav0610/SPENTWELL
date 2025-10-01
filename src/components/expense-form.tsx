import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface ExpenseFormProps {
  onClose: () => void;
  onExpenseAdded?: () => void;
}

export default function ExpenseForm({ onClose, onExpenseAdded }: ExpenseFormProps) {
  const [formState, setFormState] = useState({
    amount: "",
    title: "",
    category: "",
    date: new Date(),
    isLoading: false
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Healthcare",
    "Education",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add expenses",
        variant: "destructive",
      });
      return;
    }

    if (!formState.amount || !formState.title || !formState.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { error } = await supabase
        .from("expenses")
        .insert({
          user_id: user.id,
          title: formState.title,
          amount: parseFloat(formState.amount),
          category: formState.category,
          date: format(formState.date, "yyyy-MM-dd"),
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add expense: " + error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Expense added successfully!",
        });
        onExpenseAdded?.();
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Add New Expense</CardTitle>
          <CardDescription>Track your spending to stay on budget</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="What did you spend on?"
              value={formState.title}
              onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
              disabled={formState.isLoading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formState.amount}
                onChange={(e) => setFormState(prev => ({ ...prev, amount: e.target.value }))}
                disabled={formState.isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formState.category} 
                onValueChange={(value) => setFormState(prev => ({ ...prev, category: value }))} 
                disabled={formState.isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formState.date && "text-muted-foreground"
                  )}
                  disabled={formState.isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formState.date ? format(formState.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formState.date}
                  onSelect={(date) => date && setFormState(prev => ({ ...prev, date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full" disabled={formState.isLoading}>
            {formState.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}