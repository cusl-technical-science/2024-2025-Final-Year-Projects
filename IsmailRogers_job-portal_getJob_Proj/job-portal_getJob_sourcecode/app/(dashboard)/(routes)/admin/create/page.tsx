"use client"
 
import {z} from "zod"
import { Button } from " @/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from " @/components/ui/form";
import { Input } from " @/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from 'axios';
import toast from "react-hot-toast";


const formSchema = z.object({
    title: z.string().min(1, { message: "Job Title cannot be empty" }),
  });

const  JobCreatePage = () => {

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/jobs", values);
      router.push(`/admin/jobs/${response.data.id}`);
      toast.success("Job Created");
    } catch (error) {
      console.log((error as Error)?.message);
      //   toast notification
    }
  };

    return (
        <div className="max-w-5xl mx-auto flex items-center justify-center h-screen p-6">
        <div>
            <h1 className=" text-2xl ">Name your Job</h1>
            <p className="text-5m text-neutral-500">
            What would you like to name your job? Don&apos;t worry, you can change
            this later
            </p>
            {/* form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            {/* form fields */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g 'Full-Stack Developer'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Role of this job</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href={"/admin/jobs"}>
                <Button type="button" variant={"ghost"}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>

        </div>
    </div>
    );
};
 
export default  JobCreatePage;