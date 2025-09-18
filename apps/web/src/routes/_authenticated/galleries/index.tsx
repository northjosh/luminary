import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card";
import { Plus, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/_authenticated/galleries/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: session, isPending } = authClient.useSession();
	const navigate = Route.useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

	const { data: galleries, isLoading } = useQuery(trpc.gallery.list.queryOptions({
		limit: 20,
		offset: 0,
	}))

	useEffect(() => {
		if (!(session || isPending)) {
			navigate({
				to: "/login",
			})
		}
	}, [session, isPending]);

	if (isPending || isLoading) {
		return <div>Loading...</div>;
	}

	// Filter galleries based on search term
	const filteredGalleries = galleries?.filter(gallery =>
		gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
		gallery.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
		gallery.description?.toLowerCase().includes(searchTerm.toLowerCase())
	) || [];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800';
			case 'draft':
				return 'bg-gray-100 text-gray-800';
			case 'private':
				return 'bg-blue-100 text-blue-800';
			case 'archived':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	return (
		<div className="h-full">
			<div className="p-6">
				{/* Filter Pills */}
				<div className="flex gap-2 mb-6">
					<Button variant="outline" size="sm">
						Status <span className="ml-1 text-xs">▼</span>
					</Button>
					<Button variant="outline" size="sm">
						Category Tag <span className="ml-1 text-xs">▼</span>
					</Button>
					<Button variant="outline" size="sm">
						Event Date <span className="ml-1 text-xs">▼</span>
					</Button>
					<Button variant="outline" size="sm">
						Expiry Date <span className="ml-1 text-xs">▼</span>
					</Button>
					<Button variant="outline" size="sm">
						Starred <span className="ml-1 text-xs">▼</span>
					</Button>
				</div>

				{/* View Presets and Sort */}
				<div className="flex justify-between items-center mb-6">
					<Button variant="ghost" size="sm" className="text-teal-600">
						View Presets
					</Button>
					<div className="flex items-center gap-2">
						<span className="text-sm text-muted-foreground">Sort:</span>
						<Button variant="ghost" size="sm">
							Recent <span className="ml-1 text-xs">▼</span>
						</Button>
						<Button variant="ghost" size="sm">
							Grid <span className="ml-1 text-xs">▼</span>
						</Button>
					</div>
				</div>

				{filteredGalleries.length === 0 ? (
					<div className="text-center py-12">
						<div className="bg-muted rounded-lg p-8 max-w-md mx-auto">
							<h3 className="text-lg font-semibold mb-2">No galleries found</h3>
							<p className="text-muted-foreground mb-4">
								{searchTerm ? "Try adjusting your search terms." : "Create your first gallery to start sharing your photos with clients."}
							</p>
							{!searchTerm && (
								<Link to="/galleries/new">
									<Button>
										<Plus className="mr-2 h-4 w-4" />
										Create Gallery
									</Button>
								</Link>
							)}
						</div>
					</div>
				) : (
					<div className={viewMode === 'grid' 
						? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
						: "space-y-4"
					}>
						{filteredGalleries.map((gallery) => (
							<Card key={gallery.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
								{/* Thumbnail Image Placeholder */}
								<div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
									<div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-yellow-100 to-yellow-50 opacity-80" />
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="w-16 h-16 bg-yellow-400 rounded-full opacity-60" />
										<div className="absolute w-12 h-12 bg-yellow-300 rounded-full translate-x-4 translate-y-2" />
									</div>
									{/* Status Badge */}
									<div className="absolute top-3 right-3">
										<Badge 
											variant="secondary" 
											className={`${getStatusColor(gallery.status)} text-xs`}
										>
											{gallery.status}
										</Badge>
									</div>
									{/* Actions Menu */}
									<div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="secondary" size="sm" className="h-8 w-8 p-0">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="start">
												<DropdownMenuItem>
													<Eye className="mr-2 h-4 w-4" />
													View
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Edit className="mr-2 h-4 w-4" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem className="text-destructive">
													<Trash2 className="mr-2 h-4 w-4" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
								
								<CardContent className="p-4">
									<div className="space-y-2">
										<div className="flex items-start justify-between">
											<h3 className="font-semibold text-sm line-clamp-1">{gallery.title}</h3>
										</div>
										
										<div className="flex items-center gap-4 text-xs text-muted-foreground">
											<span className="flex items-center gap-1">
												<div className="w-2 h-2 bg-teal-500 rounded-full" />
												42 Items
											</span>
											{gallery.eventDate && (
												<span>{new Date(gallery.eventDate).toLocaleDateString('en-US', { 
													month: 'short', 
													day: 'numeric', 
													year: 'numeric' 
												})}</span>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	)
}