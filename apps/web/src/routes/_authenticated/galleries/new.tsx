import { useForm } from '@tanstack/react-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import z from 'zod/v4';
import { authClient } from '@/lib/auth-client';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect } from 'react';

export const Route = createFileRoute('/_authenticated/galleries/new')({
  component: RouteComponent,
});

const createGallerySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  slug: z.string().min(1, 'Slug is required').max(255).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  clientName: z.string().optional(),
  clientEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  eventDate: z.string().optional(),
  eventLocation: z.string().optional(),
  isPasswordProtected: z.boolean().default(false),
  password: z.string().optional(),
  allowDownloads: z.boolean().default(true),
  allowComments: z.boolean().default(false),
  storageProvider: z.enum(['local', 'google_drive', 'dropbox', 's3', 'onedrive']).default('local'),
});

function RouteComponent() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();
  const createGallery = trpc.gallery.create.useMutation();

  useEffect(() => {
    if (!session && !isPending) {
      navigate({
        to: '/login',
      });
    }
  }, [session, isPending]);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      slug: '',
      clientName: '',
      clientEmail: '',
      eventDate: '',
      eventLocation: '',
      isPasswordProtected: false,
      password: '',
      allowDownloads: true,
      allowComments: false,
      storageProvider: 'local' as const,
    },
    onSubmit: async ({ value }) => {
      try {
        await createGallery.mutateAsync({
          ...value,
          clientEmail: value.clientEmail || undefined,
          eventDate: value.eventDate || undefined,
        });
        toast.success('Gallery created successfully');
        navigate({
          to: '/galleries',
        });
      } catch (error: any) {
        toast.error(error.message || 'Failed to create gallery');
      }
    },
    validators: {
      onChange: createGallerySchema,
    },
  });

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    form.setFieldValue('title', value);
    if (!form.getFieldValue('slug')) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setFieldValue('slug', slug);
    }
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Gallery</h1>
        <p className="text-muted-foreground">Set up a new photo gallery for your client</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about your gallery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form.Field name="title">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="title">Gallery Title *</Label>
                    <Input
                      id="title"
                      placeholder="Wedding Photography - Sarah & John"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => handleTitleChange(e.target.value)}
                    />
                    {field.state.meta.errors && (
                      <p className="text-destructive text-sm">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="slug">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="slug">Gallery URL Slug *</Label>
                    <Input
                      id="slug"
                      placeholder="wedding-sarah-john"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Your gallery will be accessible at: luminary.com/gallery/{field.state.value}
                    </p>
                    {field.state.meta.errors && (
                      <p className="text-destructive text-sm">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Beautiful wedding photos from Sarah and John's special day"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              </form.Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>Details about your client and event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <form.Field name="clientName">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input
                        id="clientName"
                        placeholder="Sarah & John"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="clientEmail">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="clientEmail">Client Email</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        placeholder="sarah@example.com"
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

              <div className="grid grid-cols-2 gap-4">
                <form.Field name="eventDate">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Event Date</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="eventLocation">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="eventLocation">Event Location</Label>
                      <Input
                        id="eventLocation"
                        placeholder="Central Park, New York"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access & Privacy</CardTitle>
              <CardDescription>Control how clients can access your gallery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form.Field name="isPasswordProtected">
                {(field) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isPasswordProtected"
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(!!checked)}
                    />
                    <Label htmlFor="isPasswordProtected">Password protect this gallery</Label>
                  </div>
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="password">Gallery Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password (optional)"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={!form.getFieldValue('isPasswordProtected')}
                    />
                  </div>
                )}
              </form.Field>

              <div className="space-y-2">
                <form.Field name="allowDownloads">
                  {(field) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allowDownloads"
                        checked={field.state.value}
                        onCheckedChange={(checked) => field.handleChange(!!checked)}
                      />
                      <Label htmlFor="allowDownloads">Allow clients to download photos</Label>
                    </div>
                  )}
                </form.Field>

                <form.Field name="allowComments">
                  {(field) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allowComments"
                        checked={field.state.value}
                        onCheckedChange={(checked) => field.handleChange(!!checked)}
                      />
                      <Label htmlFor="allowComments">Allow comments on photos</Label>
                    </div>
                  )}
                </form.Field>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/galleries' })}
            >
              Cancel
            </Button>
            <form.Subscribe>
              {(state) => (
                <Button
                  type="submit"
                  disabled={!state.canSubmit || state.isSubmitting}
                  className="flex-1"
                >
                  {state.isSubmitting ? 'Creating...' : 'Create Gallery'}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </div>
      </form>
    </div>
  );
}