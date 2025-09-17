/** biome-ignore-all lint/nursery/useConsistentTypeDefinitions: <explanation> */
import Header from "@/components/header";
import Loader from "@/components/loader";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { trpc } from "@/utils/trpc";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	HeadContent,
	Outlet,
	createRootRouteWithContext,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "../index.css";
import type { Session } from "better-auth";
import { authClient } from "@/lib/auth-client";

export interface RouterAppContext {
	trpc: typeof trpc;
	queryClient: QueryClient;
	auth : {
		session: Session,
		loading: boolean
	}
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	component: RootComponent,
	beforeLoad: async () => {
    let session = null
    let isLoading = false
    
    // Only run on client
    if (typeof window !== 'undefined') {
      try {
        session = await authClient.getSession()
      } catch (error) {
        console.error('Session fetch failed:', error)
      }
    } else {
      // During SSR, mark as loading
      isLoading = true
    }
    
    return {
      auth: {
        session,
        loading:isLoading,
      }
    }
},
	head: () => ({
		meta: [
			{
				title: "luminary",
			},
			{
				name: "description",
				content: "luminary is a web application",
			},
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.ico",
			},
		],
	}),
});

function RootComponent() {
	const isFetching = useRouterState({
		select: (s) => s.isLoading,
	});

	return (
		<>
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				disableTransitionOnChange
				storageKey="luminary-ui-theme"
			>
				<div className="grid h-svh grid-rows-[auto_1fr]">
					{isFetching ? <Loader /> : <Outlet />}
				</div>
				<Toaster richColors />
			</ThemeProvider>
			<TanStackRouterDevtools position="bottom-left" />
			<ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
		</>
	);
}
