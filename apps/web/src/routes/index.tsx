import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.auth.session?.data) {
      // User is authenticated, redirect to dashboard
      throw redirect({
        to: '/dashboard',
      });
    }
  },
});
