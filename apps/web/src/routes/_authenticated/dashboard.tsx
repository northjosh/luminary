import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Images, Users, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: session, isPending } = authClient.useSession();
	const { data: galleries } = useQuery(trpc.gallery.list.queryOptions({
		limit: 5,
		offset: 0,
	}))


	if (isPending) {
		return <div>Loading...</div>;
	}

	const totalGalleries = galleries?.length || 0;
	const activeGalleries = galleries?.filter(g => g.status === 'active').length || 0;

	return (
		<div className="p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Welcome back, {session?.user.name || session?.user.name}</h1>
				<p className="text-muted-foreground">Here's an overview of your photography business</p>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Galleries</CardTitle>
						<Images className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalGalleries}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Galleries</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{activeGalleries}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Views</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">-</div>
						<p className="text-xs text-muted-foreground">Coming soon</p>
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
							<Button variant="outline" className="w-full justify-start">
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
									<div key={gallery.id} className="flex items-center justify-between">
										<div>
											<p className="font-medium text-sm">{gallery.title}</p>
											<p className="text-xs text-muted-foreground">{gallery.status}</p>
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
							<div className="text-center py-6">
								<p className="text-sm text-muted-foreground mb-3">No galleries yet</p>
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
	)
}
