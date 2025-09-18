import { createFileRoute, redirect } from '@tanstack/react-router';



export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (!context.auth.session?.data) {
      // User is not authenticated, redirect to login
      throw redirect({
		  to: '/login',
		  search: undefined
	  });
    }
    // User is  authenticated, redirect to dashboard
    throw redirect({
      to: '/dashboard',
    });
  },
});
