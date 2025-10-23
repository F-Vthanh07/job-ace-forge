import { Badge } from "@/components/ui/badge";

interface SkillBadgeProps {
  skill: string;
  level?: number;
  variant?: "default" | "primary" | "success" | "accent";
}

export const SkillBadge = ({ skill, level, variant = "default" }: SkillBadgeProps) => {
  const variantClasses = {
    default: "bg-secondary text-secondary-foreground",
    primary: "bg-primary/10 text-primary border-primary/20",
    success: "bg-success-light text-success border-success/20",
    accent: "bg-accent-light text-accent border-accent/20",
  };

  return (
    <Badge className={`${variantClasses[variant]} border px-3 py-1`}>
      {skill}
      {level && <span className="ml-2 font-bold">Lv.{level}</span>}
    </Badge>
  );
};
