import { createAuthClient } from 'better-auth/react';

const APP_URL= window.location.host

export const authClient = createAuthClient({
  baseURL: import.meta.env.LUMINARY_SERVER_URL,
});

export const signInWithGoogle = ( redirectUrl: string | undefined ) => {
  authClient.signIn.social({
    provider: 'google',
    callbackURL: `http://${APP_URL}${redirectUrl ?? "/dashboard"}`,
  });
}
