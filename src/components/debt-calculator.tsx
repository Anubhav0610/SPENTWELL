import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Calculator } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DebtInfo {
  id: string;
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
}

interface PaymentPlan {
  debtName: string;
  monthsToPayoff: number;
  totalInterest: number;
  totalPaid: number;
}

export function DebtCalculator() {
  const [debts, setDebts] = useState<DebtInfo[]>([]);
  const [newDebt, setNewDebt] = useState({
    name: "",
    balance: "",
    rate: "",
    minPayment: ""
  });
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan[]>([]);
  const [extraPayment, setExtraPayment] = useState("");
  const { toast } = useToast();

  const addDebt = () => {
    if (!newDebt.name || !newDebt.balance || !newDebt.rate || !newDebt.minPayment) {
      toast({
        title: "Missing Information",
        description: "Please fill in all debt fields",
        variant: "destructive"
      });
      return;
    }

    const debt: DebtInfo = {
      id: Date.now().toString(),
      name: newDebt.name,
      balance: parseFloat(newDebt.balance),
      rate: parseFloat(newDebt.rate),
      minPayment: parseFloat(newDebt.minPayment)
    };

    setDebts([...debts, debt]);
    setNewDebt({ name: "", balance: "", rate: "", minPayment: "" });
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const calculatePayoffPlan = () => {
    if (debts.length === 0) {
      toast({
        title: "No Debts",
        description: "Please add at least one debt to calculate",
        variant: "destructive"
      });
      return;
    }

    const extra = parseFloat(extraPayment) || 0;
    const plans: PaymentPlan[] = [];

    // Sort debts by highest interest rate (Avalanche method)
    const sortedDebts = [...debts].sort((a, b) => b.rate - a.rate);

    sortedDebts.forEach(debt => {
      const monthlyRate = debt.rate / 100 / 12;
      const payment = debt.minPayment + (debt === sortedDebts[0] ? extra : 0);
      
      if (monthlyRate === 0) {
        // No interest debt
        const months = Math.ceil(debt.balance / payment);
        plans.push({
          debtName: debt.name,
          monthsToPayoff: months,
          totalInterest: 0,
          totalPaid: debt.balance
        });
      } else {
        // Calculate months to payoff using amortization formula
        const months = Math.ceil(-Math.log(1 - (debt.balance * monthlyRate) / payment) / Math.log(1 + monthlyRate));
        const totalPaid = payment * months;
        const totalInterest = totalPaid - debt.balance;
        
        plans.push({
          debtName: debt.name,
          monthsToPayoff: months,
          totalInterest,
          totalPaid
        });
      }
    });

    setPaymentPlan(plans);
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinPayments = debts.reduce((sum, debt) => sum + debt.minPayment, 0);
  const totalInterest = paymentPlan.reduce((sum, plan) => sum + plan.totalInterest, 0);
  const avgMonths = paymentPlan.length > 0 ? Math.round(paymentPlan.reduce((sum, plan) => sum + plan.monthsToPayoff, 0) / paymentPlan.length) : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Debt Payoff Calculator
          </CardTitle>
          <CardDescription>
            Calculate the best strategy to pay off your debts using the avalanche method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Debt */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="debt-name">Debt Name</Label>
              <Input
                id="debt-name"
                placeholder="Credit Card A"
                value={newDebt.name}
                onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="balance">Balance (₹)</Label>
              <Input
                id="balance"
                type="number"
                placeholder="5000"
                value={newDebt.balance}
                onChange={(e) => setNewDebt({ ...newDebt, balance: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="rate">APR (%)</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                placeholder="18.99"
                value={newDebt.rate}
                onChange={(e) => setNewDebt({ ...newDebt, rate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="min-payment">Min Payment (₹)</Label>
              <Input
                id="min-payment"
                type="number"
                placeholder="150"
                value={newDebt.minPayment}
                onChange={(e) => setNewDebt({ ...newDebt, minPayment: e.target.value })}
              />
            </div>
          </div>
          
          <Button onClick={addDebt} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Debt
          </Button>

          {/* Current Debts */}
          {debts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Current Debts</h3>
              <div className="space-y-2">
                {debts.map((debt) => (
                  <div key={debt.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="grid grid-cols-4 gap-4 flex-1">
                      <span className="font-medium">{debt.name}</span>
                      <span>₹{debt.balance.toFixed(2)}</span>
                      <span>{debt.rate}% APR</span>
                      <span>₹{debt.minPayment.toFixed(2)}/mo</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDebt(debt.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extra Payment Input */}
          {debts.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="extra-payment">Extra Payment (₹)</Label>
                <Input
                  id="extra-payment"
                  type="number"
                  placeholder="200"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(e.target.value)}
                />
              </div>
              <Button onClick={calculatePayoffPlan} className="mt-6">
                Calculate Plan
              </Button>
            </div>
          )}

          {/* Summary Stats */}
          {debts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">₹{totalDebt.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Total Debt</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">₹{totalMinPayments.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Min Payments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">₹{totalInterest.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Total Interest</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{avgMonths}</div>
                <div className="text-sm text-muted-foreground">Avg Months</div>
              </div>
            </div>
          )}

          {/* Payment Plan Results */}
          {paymentPlan.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Payoff Plan (Highest Interest First)</h3>
              <div className="space-y-2">
                {paymentPlan.map((plan, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div>
                        <div className="font-medium">{plan.debtName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Payoff Time</div>
                        <div className="font-medium">{plan.monthsToPayoff} months</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Total Interest</div>
                        <div className="font-medium">₹{plan.totalInterest.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Total Paid</div>
                        <div className="font-medium">₹{plan.totalPaid.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}