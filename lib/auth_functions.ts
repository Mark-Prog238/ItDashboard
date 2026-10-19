import { authClient } from "@/lib/auth-client";

type SignUpData = {
    email: string;
    password: string;
    name: string;
    image?: string;
}

export const auth_signUp = async ({email, password, name, image,}: SignUpData): Promise<void> => {

    const { data, error } = await authClient.signUp.email({
        email, // user email address
        password, // user password -> min 8 characters by default
        name, // user display name
        image, // User image URL (optional)
        callbackURL: "/signin" // A URL to redirect to after the user verifies their email (optional)
    }, {
        onRequest: (ctx) => {
            //show loading
        },
        onSuccess: (ctx) => {
            //redirect to the dashboard or sign in page
        },
        onError: (ctx) => {
            // display the error message
            alert(ctx.error.message);
        },
    });
}


type signInData = {
    email: string;
    password: string;
}

export const auth_signIn = async ({email, password}: signInData): Promise<void> => {
    const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
        rememberMe: false
    }, {
        //callbacks
    })
}