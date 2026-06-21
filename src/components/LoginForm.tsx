"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, BookOpen } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "motion/react";
import { toast } from "sonner";

import { loginSchema } from "@/services/validation/login.validation";
import { loginInputFields } from "@/services/json/login.input";
import DyanmicInput from "./DyanmicInput";

import { useAuthStore } from "@/store/useAuthStore";
import { LoginPayload } from "@/types/interface/auth.interface";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect") || "/";

  const { loginUser, isLoading, isError } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginPayload) => {
    try {
      const res = await loginUser(data);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      reset();

      const role = res.data.role;

      if (role === "ADMIN") {
        router.push("/admin/dashboard");
        return;
      }

      router.push(redirect || "/");
    } catch (error) {
      const err = error as { message: string };
      toast.error(err.message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="w-full max-w-md"
      >
        <div className="rounded-3xl border bg-card p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>

            <h1 className="text-3xl font-bold">Welcome Back</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Login to continue reading articles, tutorials and stories on
              BlogHub.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {loginInputFields.map((field) => (
              <DyanmicInput
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type}
                register={register}
                error={errors[field.name as keyof LoginPayload]?.message}
              />
            ))}

            {isError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-500 dark:border-red-900 dark:bg-red-950">
                {isError}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging In...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link
              href="/forgot-password"
              className="text-muted-foreground hover:text-primary"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Create Account
            </Link>
          </div>

          <Button
            variant="outline"
            className="mt-6 w-full"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back To Blogs
          </Button>
        </div>
      </motion.div>
    </main>
  );
};

export default LoginForm;
