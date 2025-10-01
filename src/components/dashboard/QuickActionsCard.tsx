import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, MessageCircle, Target } from "lucide-react";

interface QuickActionsCardProps {
  onAddExpense: () => void;
  onAddBudget: () => void;
  onOpenAIGuide: () => void;
  onOpenDebtCalculator: () => void;
}

export function QuickActionsCard({
  onAddExpense,
  onAddBudget,
  onOpenAIGuide,
  onOpenDebtCalculator
}: QuickActionsCardProps) {
  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Manage your finances quickly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={onAddExpense} className="w-full group">
          <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          Add Expense
        </Button>
        <Button onClick={onAddBudget} variant="outline" className="w-full group">
          <Wallet className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          Set Budget
        </Button>
        <Button onClick={onOpenAIGuide} variant="outline" className="w-full group">
          <MessageCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          AI Assistant
        </Button>
        <Button onClick={onOpenDebtCalculator} variant="outline" className="w-full group">
          <Target className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          Debt Calculator
        </Button>
      </CardContent>
    </Card>
  );
}