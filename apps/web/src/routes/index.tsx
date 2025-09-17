import { createFileRoute, redirect } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
	beforeLoad: ({context})  => {
		if (context.auth.session?.data) {
			// User is authenticated, redirect to dashboard
			throw redirect({
				to: "/dashboard",
			});
		} else {
			// User is not authenticated, redirect to login
			throw redirect({
				to: "/login",
			});
		}
	}
});
