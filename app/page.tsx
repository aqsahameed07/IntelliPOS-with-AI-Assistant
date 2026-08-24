"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth, landingFor } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Boxes, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const { login, user, ready } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "admin@intellipos.com",
    password: "Admin123!",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && user) {
      router.replace(landingFor(user.role));
    }
  }, [ready, user, router]);

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const e: Record<string, string> = {};

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = "Enter a valid email";
    }

    if (form.password.length < 6) {
      e.password = "Password must be at least 6 characters";
    }

    setErrors(e);

    if (Object.keys(e).length) return;

    setLoading(true);

    try {
      const res = await login(form.email, form.password);

      setLoading(false);

      if (!res.ok) {
        toast.error(res.error);
        setErrors({ password: res.error });
        return;
      }

      toast.success(`Welcome back, ${res.user.name}!`);

      router.replace(landingFor(res.user.role));
    } catch (err) {
      setLoading(false);
      toast.error("Login failed");
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-gradient-to-br from-primary to-primary/70 p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/15">
            <Boxes className="h-5 w-5" />
          </div>

          <span className="text-lg font-semibold">IntelliPOS</span>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-semibold leading-tight">
            Run your business with an AI copilot.
          </h2>

          <p className="max-w-md text-primary-foreground/80">
            Products, inventory, billing, orders and a shopper storefront —
            all in one modern workspace.
          </p>
        </div>

        <p className="text-sm text-primary-foreground/70">
          © 2026 IntelliPos, Designed by AqsaHameed.
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md border-none shadow-none sm:border sm:shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Sign in</CardTitle>

            <CardDescription>
              Try{" "}
              <code className="rounded bg-muted px-1">
                admin@intellipos.com
              </code>{" "}
              /
              <code className="rounded bg-muted px-1">
                Admin123!
              </code>{" "}
              (Admin)
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <Field label="Email" error={errors.email}>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />
              </Field>

              <Field label="Password" error={errors.password}>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                />
              </Field>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign in
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Dont have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-primary hover:underline"
                >
                  Create one
                </Link>
              </p>

              <p className="text-center text-xs text-muted-foreground">
  Employee accounts are created by an administrator from the Admin Panel.
  If you are a customer, please{" "}
  <Link
    href="/signup"
    className="font-medium text-primary hover:underline"
  >
    sign up here
  </Link>
  .
</p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && (
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}