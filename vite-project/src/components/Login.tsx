"use client";

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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useUidStore } from "../store";

const formSchema = z.object({
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  password: z.string().min(5, {
    message: "Password must be at least 8 characters.",
  }),
});

export function Login() {
  const navigate = useNavigate();
  // ...
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    axios
      .get(import.meta.env.ROOT_URL + "validatePassword", {
        params: {
          userName: values.username,
          password: values.password,
        },
      })
      .then((response) => {
        console.log(response);
        const setUid = useUidStore.getState().setUid;
        setUid(response.data.data.uid);
        useUidStore
          .getState()
          .setNames(response.data.data.userName, response.data.data.fullName);
        navigate("/home");
      })
      .catch((error) => {
        // console.log(error);
        alert("Invalid username or password");
      });
  }

  return (
    <div className={cn("max-w-md mx-auto p-8 space-y-8")}>
      <h1 className="text-3xl font-semibold">Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormDescription>
                  Password must be at least 8 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <div className="text-center">
        <Link to="/signup" className="text-blue-500">
          Don't have an account? Signup
        </Link>
      </div>
    </div>
  );
}
