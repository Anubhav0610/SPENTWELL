import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Wallet, 
  TrendingUp, 
  PieChart, 
  Shield, 
  Smartphone,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Target,
  Calculator
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Redirect if already logged in
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const features = [
    {
      icon: DollarSign,
      title: "Expense Tracking",
      description: "Track your daily expenses with detailed categorization and insights."
    },
    {
      icon: PieChart,
      title: "Visual Analytics", 
      description: "Beautiful charts and graphs to visualize your spending patterns."
    },
    {
      icon: Target,
      title: "Budget Management",
      description: "Set monthly budgets and get alerts when you're approaching limits."
    },
    {
      icon: Calculator,
      title: "Debt Calculator",
      description: "Plan your debt payoff strategy with our advanced debt calculator."
    },
    {
      icon: TrendingUp,
      title: "Savings Goals",
      description: "Set and track progress towards your financial savings goals."
    },
    {
      icon: Shield,
      title: "AI Assistant", 
      description: "Get personalized financial advice from our AI-powered guide."
    }
  ];

  const benefits = [
    "Complete expense tracking and categorization",
    "Real-time budget monitoring and alerts", 
    "Advanced debt payoff planning tools",
    "AI-powered financial guidance",
    "Beautiful analytics and reporting",
    "Secure cloud-based storage"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10"></div>
        <div className="relative container mx-auto px-6 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
              Take Control of Your{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Financial Future
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              SpendWell is your comprehensive financial companion. Track expenses, manage budgets, 
              plan debt payoffs, and get AI-powered insights to achieve your financial goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 shadow-strong hover:shadow-medium transition-all"
                onClick={() => navigate("/auth")}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate("/auth")}
              >
                <Smartphone className="mr-2 h-5 w-5" />
                Try Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Manage Your Money
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful tools designed to simplify your financial life and help you make smarter money decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-medium hover:shadow-strong transition-all duration-300 group">
              <CardHeader>
                <div className="p-3 rounded-full bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-card/50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose SpendWell?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of users who have transformed their financial habits with our comprehensive platform.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center shadow-medium">
                <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                <div className="text-sm text-muted-foreground">Happy Users</div>
              </Card>
              <Card className="p-6 text-center shadow-medium">
                <div className="text-3xl font-bold text-success mb-2">$2M+</div>
                <div className="text-sm text-muted-foreground">Money Saved</div>
              </Card>
              <Card className="p-6 text-center shadow-medium">
                <div className="text-3xl font-bold text-accent mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </Card>
              <Card className="p-6 text-center shadow-medium">
                <div className="text-3xl font-bold text-warning mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">AI Support</div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Finances?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your journey to financial freedom today. No credit card required, cancel anytime.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-12 py-6 shadow-strong hover:shadow-medium transition-all"
            onClick={() => navigate("/auth")}
          >
            Start Your Free Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Wallet className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">SpendWell</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 SpendWell. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}