import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Activity } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ActivityForm } from '@/components/ActivityForm';
import { ActivityList } from '@/components/ActivityList';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { LogOut, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [weeklyScore, setWeeklyScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to load activities",
        description: error.message
      });
    } else if (data) {
      setActivities(data);
      
      // Calculate total score
      const total = data.reduce((sum, activity) => sum + activity.points, 0);
      setTotalScore(total);
      
      // Calculate weekly score
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyActivities = data.filter(
        activity => new Date(activity.created_at) >= weekAgo
      );
      const weekly = weeklyActivities.reduce((sum, activity) => sum + activity.points, 0);
      setWeeklyScore(weekly);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">EcoTrack</h1>
              <p className="text-sm text-muted-foreground">Welcome back!</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <ScoreDisplay totalScore={totalScore} weeklyScore={weeklyScore} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityForm onActivityAdded={fetchActivities} />
            <ActivityList activities={activities} onActivityDeleted={fetchActivities} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
