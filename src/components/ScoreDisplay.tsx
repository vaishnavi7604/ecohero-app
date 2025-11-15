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
    if (score >= 500) return { name: 'Eco Hero', color: 'text-accent', icon: '🌟' };
    return { name: 'Green Starter', color: 'text-eco-green', icon: '🌱' };
  };

  const badge = getBadge(totalScore);

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
        </CardContent>
      </Card>
    </div>
  );
};
