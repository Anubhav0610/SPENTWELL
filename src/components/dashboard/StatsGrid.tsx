import { StatCard } from "@/components/ui/stat-card";
import { TrendingUp, Wallet, Calendar, DollarSign } from "lucide-react";

interface StatsGridProps {
  totalExpenses: number;
  budget: number;
  transactionCount: number;
}

export function StatsGrid({ totalExpenses, budget, transactionCount }: StatsGridProps) {
  const budgetLeft = Math.max(0, budget - totalExpenses);
  const avgPerDay = transactionCount > 0 ? totalExpenses / new Date().getDate() : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Spent"
        value={`₹${totalExpenses.toFixed(2)}`}
        change="This month"
        changeType="neutral"
        icon={TrendingUp}
        className="shadow-medium hover:shadow-strong transition-all duration-300"
      />
      <StatCard
        title="Budget Left"
        value={`₹${budgetLeft.toFixed(2)}`}
        change={`Out of ₹${budget.toFixed(2)}`}
        changeType={budgetLeft > 0 ? "positive" : "negative"}
        icon={Wallet}
        className="shadow-medium hover:shadow-strong transition-all duration-300"
      />
      <StatCard
        title="Transactions"
        value={transactionCount.toString()}
        change="This month"
        changeType="neutral"
        icon={Calendar}
        className="shadow-medium hover:shadow-strong transition-all duration-300"
      />
      <StatCard
        title="Avg per Day"
        value={`₹${avgPerDay.toFixed(2)}`}
        change="This month"
        changeType="neutral"
        icon={DollarSign}
        className="shadow-medium hover:shadow-strong transition-all duration-300"
      />
    </div>
  );
}