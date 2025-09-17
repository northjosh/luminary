import { useForm } from '@tanstack/react-form';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import z from 'zod/v4';
import Loader from '@/components/loader';
import { LogoIcon } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isPending } = authClient.useSession();

  const navigate = useNavigate({
    from: '/',
  });


  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          name: `${value.firstName} ${value.lastName}`,
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate({
              to: '/dashboard',
            });
            toast.success('Sign up successful');
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );
    },
    validators: {
      onChange: z.object({
        firstName: z.string().min(2, 'Name must be at least 2 characters'),
        lastName: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        className="m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border bg-muted shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="-m-px rounded-[calc(var(--radius)+.125rem)] border bg-card p-8 pb-6">
          <div className="text-center">
            <Link aria-label="go home" className="mx-auto block w-fit" to="/">
              <LogoIcon />
            </Link>
            <h1 className="mt-4 mb-1 font-semibold text-xl">
              Create a luminary Account
            </h1>
            <p className="text-sm">Welcome! Create an account to get started</p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <form.Field name="firstName">
                {(field) => (
                  <div className="space-y-2">
                    <Label className="block text-sm" htmlFor="firstname">
                      First Name
                    </Label>
                    <Input
                      id="firstname"
                      name="firstname"
                      required
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors && (
                      <p className="text-destructive text-sm">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Field name="lastName">
                {(field) => (
                  <div className="space-y-2">
                    <Label className="block text-sm" htmlFor="lastName">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors && (
                      <p className="text-destructive text-sm">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="email">
              {(field) => (
                <div className="space-y-2">
                  <Label className="block text-sm" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    required
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors && (
                    <p className="text-destructive text-sm">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div className="space-y-0.5">
                  <Label className="block text-sm" htmlFor="password">
                    Password
                  </Label>
                  <Input
                    className="input sz-md variant-mixed"
                    id="password"
                    name="password"
                    required
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors && (
                    <p className="text-destructive text-sm">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
            <form.Subscribe>
              {(state) => (
                <Button
                  className="w-full"
                  disabled={!state.canSubmit || state.isSubmitting}
                  type="submit"
                >
                  {state.isSubmitting ? 'Submitting...' : 'Sign Up'}
                </Button>
              )}
            </form.Subscribe>
          </div>

          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-dashed" />
            <span className="text-muted-foreground text-xs">
              Or continue With
            </span>
            <hr className="border-dashed" />
          </div>

          <div className="grid gap-3">
            <Button type="button" variant="outline">
              <svg
                height="1em"
                viewBox="0 0 256 262"
                width="0.98em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  fill="#4285f4"
                />
                <path
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  fill="#34a853"
                />
                <path
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                  fill="#fbbc05"
                />
                <path
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  fill="#eb4335"
                />
              </svg>
              <span>Google</span>
            </Button>
          </div>
        </div>
        <div className="p-3">
          <p className="text-center text-accent-foreground text-sm">
            Have an account ?
            <Button asChild className="px-2" variant="link">
              <Link to="/login">Sign In</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
