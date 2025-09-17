import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { galleryRouter } from "./gallery";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	privateData: protectedProcedure.query(({ ctx }) => {
		return {
			message: "This is private",
			user: ctx.session.user,
		};
	}),
	gallery: galleryRouter,
});
export type AppRouter = typeof appRouter;
