import { useForm } from '@tanstack/react-form';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import Loader from '@/components/loader';
import { LogoIcon } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient, signInWithGoogle } from '@/lib/auth-client';
import { ZSignUpSchema } from '@/types/auth.schema';
import { GoogleLogo } from '@/components/icons/google-logo';

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
  validateSearch: (search: { redirect: string | undefined }) => {
    return search;
  },
});

function RouteComponent() {
  const { isPending } = authClient.useSession();
  const { redirect: redirectUrl } = Route.useSearch();

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
              to: redirectUrl ?? '/dashboard',
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
      onChange: ZSignUpSchema,
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
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                      type="text"
                      value={field.state.value}
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
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      required
                      type="text"
                      value={field.state.value}
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
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                    type="email"
                    value={field.state.value}
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
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                    type="password"
                    value={field.state.value}
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
            <Button
              onClick={() => signInWithGoogle(redirectUrl)}
              type="button"
              variant="outline"
            >
              <GoogleLogo />
              <span>Google</span>
            </Button>
          </div>
        </div>
        <div className="p-3">
          <p className="text-center text-accent-foreground text-sm">
            Have an account ?
            <Button asChild className="px-2" variant="link">
              <Link search={{ redirect: redirectUrl }} to="/login">
                Sign In
              </Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
