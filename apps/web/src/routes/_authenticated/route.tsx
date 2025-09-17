import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
   if (!context.auth.session?.data) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname,
        },
      })
    }
  },
})

function RouteComponent() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
