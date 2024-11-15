"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoaderCircle } from 'lucide-react'

import * as z from "zod";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[!@#$%^&*]/, {
      message: "Password must contain at least one special character",
    }),
});

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.errors) {
          Object.entries(errorData.errors).forEach(([key, message]) => {
            // Assert message to be a string
            form.setError(key as keyof typeof values, {
              type: "manual",
              message: typeof message === "string" ? message : "Unknown error",
            });
          });
        } else {
          throw new Error("Registration failed");
        }
      } else {
        const p = await response.json();
        console.log(p)
        alert("Registration successful. Redirecting to sign-in page.");
        // setTimeout(() => {
        //   router.push("/signup");
        // }, 2000);
      }
    } catch (error) {
      console.log(error)
      alert("Registration failed. There was a problem creating your account.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="container mx-auto max-w-md p-6">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Welcome to Wellness</h2>
          <p className="font-light text-[#8CA2C0]">Fill in the form to register</p>
        </div>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <label className="block text-xs font-light text-[#89A6CD] ">Name</label>
            <input
              type="text"
              placeholder="your-name"
              className="block w-full border border-[#89A6CD] rounded-lg px-3 py-2"
              {...form.register("username")}
            />
            {form.formState.errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-light text-[#89A6CD] ">Email</label>
            <input
              type="email"
              placeholder="your-email@gmail.com"
              className="block w-full border border-[#89A6CD] rounded-lg px-3 py-2"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-light text-[#89A6CD] ">Password</label>
            <input
              type="password"
              placeholder="**********"
              className="block w-full border border-[#89A6CD] rounded-lg px-3 py-2"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
        </form>
      </div>

      <div className="fixed mt-4 bottom-2 mb-4 w-full px-6 -m-4">
        <button onClick={form.handleSubmit(onSubmit)} disabled={isLoading} className="w-full bg-primary font-semibold text-white py-3 rounded-3xl flex items-center justify-center">
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />

              Registering...
            </>
          ) : (
            "Register"
          )}
        </button>
      </div>
    </div>
  );
}
