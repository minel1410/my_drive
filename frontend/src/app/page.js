"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  password: z
    .string()
    .min(2, { message: "Password must be at least 2 characters." })
    .max(25, { message: "Password must be max 25 characters." }),
});

export default function Login() {
  const { login } = useAuth();
  const { user } = useAuth();
  const router = useRouter();

    const [loginError, setLoginError] = useState(null);

  // React Hook Form setup
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = (data) => {
    const savedPassword = process.env.NEXT_PUBLIC_PASSWORD;

    if (data.password === savedPassword) {
      login(data.password);
    } else {
      setLoginError("Wrong password");
    }
  };

  // Redirekcija ako je korisnik već autentifikovan
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      router.push("/drive");
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please enter the correct password to continue.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {loginError && (
            <div className="text-red-700 text-sm">{loginError}</div>
          )}
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded"
          >
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
