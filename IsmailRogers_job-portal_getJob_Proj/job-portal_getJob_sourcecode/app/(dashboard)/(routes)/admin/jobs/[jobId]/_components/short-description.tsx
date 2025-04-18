"use client";

import { Button } from " @/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from " @/components/ui/form";
import { Textarea } from " @/components/ui/textarea";
import getGenerativeAIResponse from " @/scripts/aistudio";

import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import axios from "axios";
import { Lightbulb, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ShortDescriptionProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  short_description: z.string().min(1, "Short description is required."),
});

export const ShortDescription = ({
  initialData,
  jobId,
}: ShortDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      short_description: initialData?.short_description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Submitting values:", values); // Debugging
      const response = await axios.patch(`/api/jobs/${jobId}`, values);
      console.log("API Response:", response); // Debugging
      toast.success("Job updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      console.error("API Error:", error); // Debugging
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);
      const customPrompt = `Could you craft a concise job description for a ${prompt} position in fewer than 400 characters?`;

      await getGenerativeAIResponse(customPrompt).then((data) => {
        form.setValue("short_description", data, { shouldValidate: true });
        setIsPrompting(false);
      });
    } catch (error) {
      console.error("Prompt Generation Error:", error); // Debugging
      toast.error("Something went wrong...");
      setIsPrompting(false);
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Short Description
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p className="text-neutral-500">{initialData?.short_description}</p>
      )}

      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="e.g 'Full-Stack Developer'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 rounded-md"
            />
            {isPrompting ? (
              <Button>
                <Loader2 className="w4 h-4 animate-spin" />
              </Button>
            ) : (
              <Button onClick={handlePromptGeneration}>
                <Lightbulb className="w4 h-4 " />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Note*: Profession Name alone is enough to generate the tags
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="short_description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting}
                        placeholder="Short description about the job"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-x-2">
                <Button disabled={!isValid || isSubmitting} type="submit">
                  {isSubmitting ? (
                    <Loader2 className="w4 h-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </>

      )}
    </div>
  );
};
