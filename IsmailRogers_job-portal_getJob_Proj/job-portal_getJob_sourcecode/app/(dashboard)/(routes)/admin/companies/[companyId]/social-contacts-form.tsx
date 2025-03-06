"use client";

import { Button } from " @/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from " @/components/ui/form";
import { Input } from " @/components/ui/input";
import { Textarea } from " @/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "@prisma/client";
import axios from "axios";
import { Globe, Linkedin, Mail, MapPin, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CompanySocialContactsFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  mail: z.string().min(1, { message: "Mail is required" }),
  website: z.string().min(1, { message: "Website is required" }),
  linkedIn: z.string().min(1, { message: "LinkedIn is required" }),
  address_line_1: z.string().min(1, { message: "Address Line 1 is required" }),
  city: z.string().min(1, { message: "City is required" }),
  area: z.string().min(1, { message: "Area is required" }),
  p_num: z
  .string()
  .regex(/^232(75|76|34|88|79|30|32|99)\d{6}$/, 
    "Invalid Sierra Leone phone number (must start with 232, followed by 75, 76, 34, 88, 79, 30, 32, or 99, and then 6 more digits)"
  ),

});

export const CompanySocialContactsForm = ({
  initialData,
  companyId,
}: CompanySocialContactsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mail: initialData?.mail || "",
      website: initialData.website || "",
      linkedIn: initialData.linkedIn || "",
      address_line_1: initialData.address_line_1 || "",
      city: initialData.city || "",
      area: initialData.area || "",
      p_num: initialData.p_num || "",
    },
  });

  const { isSubmitting} = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Submitting values:", values); // Debugging
    try {
      const response = await axios.patch(`/api/companies/${companyId}`, values);
      console.log("Response:", response.data); // Debugging
      toast.success("Company updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      console.error("Error updating company:", error); // Debugging
      toast.error("Something went wrong");
    }
  };
  

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Company Socials
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

      {/* display the name if not editing */}
      {!isEditing && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-3">
              {initialData.mail && (
                <div className="text-sm text-neutral-500 flex items-center w-full truncate">
                  <Mail className="w-3 h-3 mr-2" />
                  {initialData.mail}
                </div>
              )}

              {initialData.linkedIn && (
                <Link
                  href={initialData.linkedIn}
                  className="text-sm text-neutral-500 flex items-center w-full truncate"
                >
                  <Linkedin className="w-3 h-3 mr-2" />
                  {initialData.linkedIn}
                </Link>
              )}

              {initialData.website && (
                <Link
                  href={initialData.website}
                  className="text-sm text-neutral-500 flex items-center w-full truncate"
                >
                  <Globe className="w-3 h-3 mr-2" />
                  {initialData.website}
                </Link>
              )}
            </div>
            <div className="col-span-3">
              {initialData.address_line_1 && (
                <div className="flex items-start gap-2 justify-start">
                  <MapPin className="w-3 h-3 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {initialData.address_line_1}, 
                    </p>
                    
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* on editing mode display the input */}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="mail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Mail: 'sample@maildomain.com'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Website Link: 'https://compnaylive.live'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedIn"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Linkedin Link: 'https://linkedin.in/@yourname'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_line_1"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Address Line 1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            

            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="City"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="Area"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

<FormField control={form.control} name="p_num" render={({ field }) => (
                <FormItem>
                  <FormControl><Input disabled={isSubmitting} placeholder="Phone Number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="flex items-center gap-x-2">
            <Button disabled={isSubmitting} type="submit">
  Save
</Button>

            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
