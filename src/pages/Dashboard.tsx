import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "@/components/expense-form";
import BudgetForm from "@/components/budget-form";
import AIGuide from "@/components/ai-guide";
import SavingsGoals from "@/components/savings-goals";
import RecentTransactions from "@/components/recent-transactions";
import { SpendingChart } from "@/components/spending-chart";
import { DebtCalculator } from "@/components/debt-calculator";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
import { ModalContainer } from "@/components/modals/ModalContainer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showAIGuide, setShowAIGuide] = useState(false);
  const [showDebtCalculator, setShowDebtCalculator] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [budget, setBudget] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [spendingData, setSpendingData] = useState<any[]>([]);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, refreshTrigger]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch budget
      const { data: budgetData } = await supabase
        .from("budgets")
        .select("amount")
        .eq("user_id", user.id)
        .single();

      setBudget(budgetData?.amount || 0);

      // Fetch expenses for current month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: expensesData } = await supabase
        .from("expenses")
        .select("amount")
        .eq("user_id", user.id)
        .gte("date", startOfMonth.toISOString().split('T')[0]);

      if (expensesData) {
        const total = expensesData.reduce((sum, expense) => sum + parseFloat(expense.amount.toString()), 0);
        setTotalExpenses(total);
        setTransactionCount(expensesData.length);
      }

      // Fetch spending data by category
      const { data: categoryData } = await supabase
        .from("expenses")
        .select("category, amount")
        .eq("user_id", user.id)
        .gte("date", startOfMonth.toISOString().split('T')[0]);

      if (categoryData) {
        const categoryTotals = categoryData.reduce((acc: any, expense: any) => {
          const category = expense.category;
          const amount = parseFloat(expense.amount.toString());
          acc[category] = (acc[category] || 0) + amount;
          return acc;
        }, {});

        const chartData = Object.entries(categoryTotals).map(([category, amount]: [string, any]) => ({
          category,
          amount,
          color: ''
        }));

        setSpendingData(chartData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-primary/20 border-t-primary mx-auto"></div>
          <p className="text-lg font-medium text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <DashboardHeader userEmail={user.email || ''} onLogout={handleLogout} />
        
        <StatsGrid 
          totalExpenses={totalExpenses}
          budget={budget}
          transactionCount={transactionCount}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Charts and Transactions */}
          <div className="lg:col-span-2 space-y-6">
            <SpendingChart data={spendingData} />
            <RecentTransactions refreshTrigger={refreshTrigger} />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <QuickActionsCard
              onAddExpense={() => setShowForm(true)}
              onAddBudget={() => setShowBudgetForm(true)}
              onOpenAIGuide={() => setShowAIGuide(true)}
              onOpenDebtCalculator={() => setShowDebtCalculator(true)}
            />
          </div>
        </div>

        {/* Savings Goals */}
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <SavingsGoals totalExpenses={totalExpenses} currentBudget={budget} />
        </div>

        {/* Modals */}
        <ModalContainer 
          isOpen={showForm} 
          onClose={() => setShowForm(false)}
          title="Add New Expense"
        >
          <ExpenseForm 
            onClose={() => setShowForm(false)} 
            onExpenseAdded={() => setRefreshTrigger(Date.now())}
          />
        </ModalContainer>

        <ModalContainer 
          isOpen={showBudgetForm} 
          onClose={() => setShowBudgetForm(false)}
          title="Set Monthly Budget"
        >
          <BudgetForm 
            onClose={() => setShowBudgetForm(false)} 
            onBudgetUpdated={() => {
              setRefreshTrigger(Date.now());
              fetchDashboardData();
            }}
            currentBudget={budget}
          />
        </ModalContainer>

        <ModalContainer 
          isOpen={showAIGuide} 
          onClose={() => setShowAIGuide(false)}
          maxWidth="max-w-4xl"
        >
          <AIGuide onClose={() => setShowAIGuide(false)} />
        </ModalContainer>

        <ModalContainer 
          isOpen={showDebtCalculator} 
          onClose={() => setShowDebtCalculator(false)}
          title="Debt Payoff Calculator"
          maxWidth="max-w-6xl"
        >
          <DebtCalculator />
        </ModalContainer>
      </div>
    </div>
  );
}