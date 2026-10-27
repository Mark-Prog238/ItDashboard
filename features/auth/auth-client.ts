import { createAuthClient } from "better-auth/react";

// Če baseURL ni podan, better-auth samodejno uporabi window.location.origin (deluje na localhost in na 10.31.1.80:3000)
export const authClient = createAuthClient();

