import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: import.meta.env.LUMINARY_SERVER_URL,
});

export const signInWithGoogle = (redirectUrl: string | undefined) => {
  const APP_URL =
    import.meta.env.VITE_APP_URL ||
    (typeof window !== 'undefined' ? window.location.host : 'localhost:3001');

  authClient.signIn.social({
    provider: 'google',
    callbackURL: `${APP_URL}${redirectUrl ?? '/dashboard'}`,
  });
};
