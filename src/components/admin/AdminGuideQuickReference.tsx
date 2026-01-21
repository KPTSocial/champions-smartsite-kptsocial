import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ClipboardList, 
  Calendar, 
  Clock, 
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const quickTasks = [
  {
    icon: ClipboardList,
    label: 'Update monthly specials',
    path: '/admin/menu',
    description: 'Menu → Monthly Specials tab',
  },
  {
    icon: Calendar,
    label: 'Add an event',
    path: '/admin/events',
    description: 'Events → Create Event',
  },
  {
    icon: Clock,
    label: 'Change hours',
    path: '/admin/settings',
    description: 'Settings → Hours of Operation',
  },
  {
    icon: MessageSquare,
    label: 'Check feedback',
    path: '/admin/feedback',
    description: 'View guest submissions',
  },
  {
    icon: Sparkles,
    label: 'Manage homepage cards',
    path: '/admin/events',
    description: 'Events → Seasonal Cards section',
  },
];

const AdminGuideQuickReference: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Most Common Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {quickTasks.map((task, index) => {
              const Icon = task.icon;
              return (
                <Link
                  key={index}
                  to={task.path}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{task.label}</p>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Need More Help?</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            If you have questions or need assistance, reach out to your site administrator 
            or refer back to this guide anytime from the navigation menu.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGuideQuickReference;
