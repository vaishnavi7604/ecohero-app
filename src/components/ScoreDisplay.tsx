import { Card, CardContent } from '@/components/ui/card';
import { Trophy, TrendingUp, Calendar } from 'lucide-react';

export const ScoreDisplay = ({ 
  totalScore, 
  weeklyScore 
}: { 
  totalScore: number;
  weeklyScore: number;
}) => {
  const getBadge = (score: number) => {
    if (score >= 500) return { name: 'Eco Hero', color: 'text-accent', icon: '🌟', next: null };
    if (score >= 300) return { name: 'Eco Warrior', color: 'text-primary', icon: '⚡', next: 500 };
    if (score >= 150) return { name: 'Nature Friend', color: 'text-eco-green-light', icon: '🌿', next: 300 };
    if (score >= 50) return { name: 'Green Starter', color: 'text-eco-green', icon: '🍃', next: 150 };
    return { name: 'Eco Beginner', color: 'text-muted-foreground', icon: '🌱', next: 50 };
  };

  const badge = getBadge(totalScore);
  const progress = badge.next ? Math.min((totalScore / badge.next) * 100, 100) : 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="shadow-[var(--shadow-card)] bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Score</p>
              <p className="text-4xl font-bold text-primary">{totalScore}</p>
            </div>
            <Trophy className="h-12 w-12 text-primary opacity-20" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-card)] bg-gradient-to-br from-eco-green/5 to-eco-sky/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Weekly Total</p>
              <p className="text-4xl font-bold text-eco-green">{weeklyScore}</p>
            </div>
            <Calendar className="h-12 w-12 text-eco-green opacity-20" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-card)] bg-gradient-to-br from-accent/5 to-primary/5">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Badge</p>
                <p className={`text-2xl font-bold ${badge.color} flex items-center gap-2`}>
                  <span className="text-3xl">{badge.icon}</span>
                  {badge.name}
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-accent opacity-20" />
            </div>
            {badge.next && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Next: {badge.next} pts</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
