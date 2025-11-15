import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from '@/lib/supabase';
import { format } from 'date-fns';
import { ListChecks, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const categoryEmojis: Record<string, string> = {
  recycling: '♻️',
  afforestation: '🌳',
  energy_saving: '💡',
  eco_transportation: '🚲',
  sustainable_food: '🥗',
  water_conservation: '💧',
  other: '🌍'
};

const categoryLabels: Record<string, string> = {
  recycling: 'Recycling',
  afforestation: 'Afforestation',
  energy_saving: 'Energy Saving',
  eco_transportation: 'Eco Transportation',
  sustainable_food: 'Sustainable Food',
  water_conservation: 'Water Conservation',
  other: 'Other'
};

export const ActivityList = ({ 
  activities, 
  onActivityDeleted 
}: { 
  activities: Activity[];
  onActivityDeleted: () => void;
}) => {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete",
        description: error.message
      });
    } else {
      toast({
        title: "Activity deleted"
      });
      onActivityDeleted();
    }
  };

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" />
          Recent Activities
        </CardTitle>
        <CardDescription>Your environmental contributions</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No activities yet. Start logging your eco-friendly actions!
          </p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{categoryEmojis[activity.category]}</span>
                  <div className="flex-1">
                    <h4 className="font-medium">{activity.activity_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {categoryLabels[activity.category]} • {format(new Date(activity.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary">+{activity.points}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(activity.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
