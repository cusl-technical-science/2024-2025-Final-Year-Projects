"use client";

import Box from " @/components/box";
import { Button } from " @/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from " @/components/ui/form";
import { Input } from " @/components/ui/input";
import { cn } from " @/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { Pencil, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ContactFormProps {
  initialData: UserProfile | null;
  userId: string;
}

const formSchema = z.object({
  contact: z
    .string()
    .min(1, { message: "Contact Number is required" })
    .regex(
      /^232(75|76|34|88|79|30|32|99)\d{6}$/,
      "Invalid Sierra Leone phone number (must start with 232, followed by 75, 76, 34, 88, 79, 30, 32, or 99, and then 6 more digits)"
    ),
});

export const ContactForm = ({ initialData, userId }: ContactFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact: initialData?.contact || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await axios.patch(`/api/users/${userId}`, values);
      toast.success("Profile updated");
      toggleEditing();
      router.refresh();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <Box>
      {!isEditing && (
        <div
          className={cn(
            "text-lg mt-2 flex items-center gap-2",
            !initialData?.contact && "text-neutral-500 italic"
          )}
        >
          <UserCircle className="w-4 h-4 mr-2" />
          {initialData?.contact ? initialData.contact : "No Contact"}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2 flex-1"
          >
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g '+23275940495'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}

      <Button onClick={toggleEditing} variant={"ghost"}>
        {isEditing ? (
          <>Cancel</>
        ) : (
          <>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </>
        )}
      </Button>
    </Box>
  );
};
