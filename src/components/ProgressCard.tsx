import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface ProgressCardProps {
  title: string;
  value: number;
  maxValue: number;
  icon: LucideIcon;
  color?: "primary" | "accent" | "success";
}

export const ProgressCard = ({ 
  title, 
  value, 
  maxValue, 
  icon: Icon,
  color = "primary" 
}: ProgressCardProps) => {
  const percentage = (value / maxValue) * 100;
  
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    accent: "text-accent bg-accent-light",
    success: "text-success bg-success-light",
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-3xl font-bold text-foreground">
            {value}
            <span className="text-lg text-muted-foreground">/{maxValue}</span>
          </p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <Progress value={percentage} className="h-2" />
    </Card>
  );
};
