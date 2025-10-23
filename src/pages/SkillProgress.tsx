import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { ProgressCard } from "@/components/ProgressCard";
import { SkillBadge } from "@/components/SkillBadge";
import { Trophy, Target, Zap, TrendingUp, Award, Star } from "lucide-react";

const SkillProgress = () => {
  const skills = [
    { skill: "Communication", level: 8, variant: "primary" as const },
    { skill: "Problem Solving", level: 7, variant: "success" as const },
    { skill: "Leadership", level: 6, variant: "accent" as const },
    { skill: "Technical Skills", level: 9, variant: "primary" as const },
  ];

  const achievements = [
    { title: "First Interview", icon: Star, unlocked: true },
    { title: "Perfect Score", icon: Trophy, unlocked: true },
    { title: "10 Interviews", icon: Target, unlocked: true },
    { title: "Month Streak", icon: Zap, unlocked: false },
    { title: "Skill Master", icon: Award, unlocked: false },
    { title: "CV Expert", icon: TrendingUp, unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Progress Dashboard</h1>
          <p className="text-muted-foreground">Track your skill development and achievements</p>
        </div>

        {/* Progress Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <ProgressCard
            title="Total XP"
            value={2450}
            maxValue={3000}
            icon={Zap}
            color="primary"
          />
          <ProgressCard
            title="Level Progress"
            value={7}
            maxValue={10}
            icon={TrendingUp}
            color="accent"
          />
          <ProgressCard
            title="Achievements"
            value={3}
            maxValue={6}
            icon={Trophy}
            color="success"
          />
        </div>

        {/* Skills Grid */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Skill Levels</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skill) => (
              <div key={skill.skill}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{skill.skill}</h3>
                  <SkillBadge skill="" level={skill.level} variant={skill.variant} />
                </div>
                <div className="h-4 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      skill.variant === "primary" ? "gradient-primary" :
                      skill.variant === "accent" ? "gradient-accent" :
                      "bg-success"
                    }`}
                    style={{ width: `${skill.level * 10}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {skill.level * 100} / 1000 XP
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Achievements</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.title}
                  className={`p-6 rounded-lg border text-center transition-all duration-300 ${
                    achievement.unlocked
                      ? "border-primary bg-primary/5 hover:shadow-lg"
                      : "border-border bg-muted/50 opacity-50"
                  }`}
                >
                  <div className={`inline-flex p-4 rounded-full mb-3 ${
                    achievement.unlocked ? "gradient-primary shadow-glow" : "bg-secondary"
                  }`}>
                    <Icon className={`h-8 w-8 ${
                      achievement.unlocked ? "text-white" : "text-muted-foreground"
                    }`} />
                  </div>
                  <h3 className="font-semibold">{achievement.title}</h3>
                  {achievement.unlocked && (
                    <p className="text-xs text-success mt-1">Unlocked!</p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SkillProgress;
