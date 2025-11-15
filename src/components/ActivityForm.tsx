import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';

type Category = 'recycling' | 'afforestation' | 'energy_saving' | 'eco_transportation' | 'sustainable_food' | 'water_conservation' | 'other';

const categoryInfo: Record<Category, { label: string; points: number; emoji: string }> = {
  recycling: { label: 'Recycling', points: 10, emoji: '♻️' },
  afforestation: { label: 'Afforestation', points: 25, emoji: '🌳' },
  energy_saving: { label: 'Energy Saving', points: 15, emoji: '💡' },
  eco_transportation: { label: 'Eco Transportation', points: 20, emoji: '🚲' },
  sustainable_food: { label: 'Sustainable Food', points: 12, emoji: '🥗' },
  water_conservation: { label: 'Water Conservation', points: 18, emoji: '💧' },
  other: { label: 'Other', points: 5, emoji: '🌍' }
};

export const ActivityForm = ({ onActivityAdded }: { onActivityAdded: () => void }) => {
  const [activityName, setActivityName] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activityName || !category || !user) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all fields"
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('activities')
      .insert({
        user_id: user.id,
        activity_name: activityName,
        category: category
      });

    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to add activity",
        description: error.message
      });
    } else {
      toast({
        title: "Activity added!",
        description: `You earned ${categoryInfo[category].points} points`
      });
      setActivityName('');
      setCategory('');
      onActivityAdded();
    }
  };

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-primary" />
          Add Daily Activity
        </CardTitle>
        <CardDescription>Log your eco-friendly actions</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activity">Activity Name</Label>
            <Input
              id="activity"
              placeholder="e.g., Used reusable bag"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {Object.entries(categoryInfo).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    {info.emoji} {info.label} (+{info.points} pts)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding...' : 'Add Activity'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
