import { createFileRoute, Link } from '@tanstack/react-router';
import { authClient } from '@/lib/auth-client';
import { trpc } from '@/utils/trpc';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus, Images, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session, isPending } = authClient.useSession();
  const { data: galleries } = useQuery(
    trpc.gallery.list.queryOptions({
      limit: 5,
      offset: 0,
    })
  );

  if (isPending) {
    return <div>Loading...</div>;
  }

  const totalGalleries = galleries?.length || 0;
  const activeGalleries =
    galleries?.filter((g) => g.status === 'active').length || 0;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="font-bold text-3xl">
          Welcome back, {session?.user.name || ' '}
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your photography business
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Galleries
            </CardTitle>
            <Images className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalGalleries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Active Galleries
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{activeGalleries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Views</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">-</div>
            <p className="text-muted-foreground text-xs">Coming soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/galleries/new" className="block">
              <Button className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Create New Gallery
              </Button>
            </Link>
            <Link to="/galleries" className="block">
              <Button className="w-full justify-start" variant="outline">
                <Images className="mr-2 h-4 w-4" />
                Manage Galleries
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Galleries</CardTitle>
            <CardDescription>Your latest photo galleries</CardDescription>
          </CardHeader>
          <CardContent>
            {galleries && galleries.length > 0 ? (
              <div className="space-y-3">
                {galleries.slice(0, 3).map((gallery) => (
                  <div
                    key={gallery.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-sm">{gallery.title}</p>
                      <p className="text-muted-foreground text-xs">
                        {gallery.status}
                      </p>
                    </div>
                    {/* <Link to={`/galleries/${gallery.id}`}>
											<Button variant="ghost" size="sm">View</Button>
										</Link> */}
                  </div>
                ))}
                <Link to="/galleries" className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Galleries
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="mb-3 text-muted-foreground text-sm">
                  No galleries yet
                </p>
                <Link to="/galleries/new">
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Gallery
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
