import {LoginForm} from "@/features/auth/components/login-form";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {Suspense} from "react";
import {auth} from "@/auth";

async function SessionRedirectCheck() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (session) {
        console.log(session) // DEBUG
        redirect("/mobilepos/devices");
    }
    return null;

}

export default function AuthPage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Suspense fallback={<LoginForm />}>
                    <SessionRedirectCheck />
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
