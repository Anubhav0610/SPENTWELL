import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, Settings } from "lucide-react";

interface DashboardHeaderProps {
  userEmail: string;
  onLogout: () => void;
}

export function DashboardHeader({ userEmail, onLogout }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Track your expenses and manage your budget</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border">
          <User className="h-5 w-5 text-primary" />
          <span className="font-medium text-sm">{userEmail}</span>
          <Badge variant="secondary" className="text-xs">Free</Badge>
        </div>
        <Button variant="ghost" size="sm" className="hover:bg-secondary">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onLogout} className="hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}