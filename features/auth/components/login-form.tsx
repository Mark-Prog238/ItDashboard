"use client";

import { useState } from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

export function LoginForm({
  className,
  ...props
}: ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const handleSubmit = async (form: FormData) => {
    setError(null);
    setLoading(true);

    const username = (form.get("username") as string)?.trim();
    const password = form.get("password") as string;

    try {
      const response = await fetch("/api/auth/sign-in/ldap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Napačno uporabniško ime ali geslo.");
        setLoading(false);
        return;
      }

      // Uspešna prijava - seja je varno shranjena v HTTP-only piškotku
      router.replace("/mobilepos/devices")
    } catch (error) {
      console.log(error)
      setError("Napaka pri povezavi s strežnikom.");
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Prijava v IT Dashboard</CardTitle>
          <CardDescription>
            Prijavite se s svojim domenskim (Active Directory) računom
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <FieldGroup>
              {error && (
                <div className="p-3 text-sm font-medium rounded-md bg-destructive/15 text-destructive border border-destructive/20 text-center">
                  {error}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="username">Domensko uporabniško ime / Email</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="ime.priimek"
                  autoComplete="username"
                  required
                  disabled={loading}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Domensko geslo</FieldLabel>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
              </Field>
              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Preverjanje z Active Directory..." : "Prijava"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
