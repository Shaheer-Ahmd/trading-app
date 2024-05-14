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
import confetti from "canvas-confetti";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useUidStore } from "../store";

const formSchema = z.object({
  oldPassword: z.string().min(4, {
    message: "Old Password must be at least 5 characters.",
  }),
  newPassword: z.string().min(5, {
    message: "Password must be at least 5 characters.",
  }),
});

export function ChangePassword() {
  const navigate = useNavigate();
  // ...
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    axios
      .post("https://trading-app-a69n.onrender.com/" + "changePassword", {
        uid: useUidStore.getState().uid,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })
      .then((response) => {
        console.log(response);
        // const setUid = useUidStore.getState().setUid;
        // setUid(response.data.data.uid);
        // useUidStore.getState().setNames(response.data.data.userName, response.data.data.fullName);
        navigate("/profile");
        confetti();
      })
      .catch((error) => {
        // console.log(error);
        alert(error.response.data);
      });
  }

  return (
    <div className={cn("max-w-md mx-auto p-8 space-y-8")}>
      <h1 className="text-3xl font-semibold">Change Password</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Password</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>This is your old password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormDescription>
                  Password must be at least 5 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
