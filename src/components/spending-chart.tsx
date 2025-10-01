import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface SpendingData {
  category: string;
  amount: number;
  color: string;
}

interface SpendingChartProps {
  data: SpendingData[];
  chartType?: "pie" | "bar";
}

const COLORS = [
  "hsl(158, 50%, 38%)",
  "hsl(213, 75%, 55%)",
  "hsl(35, 85%, 55%)",
  "hsl(0, 75%, 55%)",
  "hsl(280, 50%, 55%)",
  "hsl(20, 85%, 55%)",
];

export function SpendingChart({ data, chartType = "pie" }: SpendingChartProps) {
  const enhancedData = data.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
  }));

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  if (chartType === "bar") {
    return (
    <Card className="shadow-medium hover:shadow-strong transition-all duration-300">
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>Your expenses broken down by category</CardDescription>
      </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enhancedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`₹${Number(value).toFixed(2)}`, "Amount"]}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-medium hover:shadow-strong transition-all duration-300">
      <CardHeader>
        <CardTitle>Spending Breakdown</CardTitle>
        <CardDescription>Your expenses by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="h-[300px] w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={enhancedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="amount"
                >
                  {enhancedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full lg:w-1/2 space-y-3">
            {enhancedData.map((item, index) => {
              const percentage = ((item.amount / totalAmount) * 100).toFixed(1);
              return (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">₹{item.amount.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}