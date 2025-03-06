import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from " @/lib/db"; // Fixed extra space in import
import Link from "next/link";
import { ArrowLeft, Building2, File, LayoutDashboard, ListChecks } from "lucide-react";
import { JobPublishAction } from "./_components/job-publish-actions";
import { Banner } from " @/components/ui/banner";
import { IconBadge } from " @/components/ui/icon-badge";
import { TitleForm } from "./_components/title-form";
import { CategoryForm } from "./_components/category-form";
import { ImageForm } from "./_components/image-form";
import { ShortDescription } from "./_components/short-description";
import { ShiftTimingForm } from "./_components/shift-timing-mode";
import { HourlyRateForm } from "./_components/hourly-rate-form";
import { WorkModeForm } from "./_components/work-mode-form";
import { YearsOfExperienceForm } from "./_components/work-experience-form";
import { JobDescription } from "./_components/job-description";
import { TagsForm } from "./_components/tags-form";
import { CompanyForm } from "./_components/company-form";
import { AttachmentsForm } from "./_components/attachments-form";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;

  // Extract jobId correctly
  const {jobId } =await params;

  // Validate jobId
  if (!validObjectIdRegex.test(jobId)) {
    return redirect("/admin/jobs");
  }

  // Get user ID from Clerk
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  // Fetch job from database
  const job = await db.job.findUnique({
    where: {
      id: jobId,
      userId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",

        }
      }
      
    },
  });

  // Fetch categories
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const companies =await db.company.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });


  if (!job) {
    return redirect("/admin/jobs");
  }

  // Check field completeness
  const requiredFields = [job.title, job.description, job.imageUrl, job.categoryId];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <Link href="/admin/jobs">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>

      {/* Title */}
      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Job Setup</h1>
          <span className="text-sm text-neutral-500">
            Complete All Fields {completionText}
          </span>
        </div>

        {/* Action button */}
        <JobPublishAction
          jobId={jobId}
          isPublished={job.isPusblished} // Fixed typo
          disabled={!isComplete}
        />
      </div>

      {/* Warning before publishing the job */}
      {!job.isPusblished && (
        <Banner
          variant={"warning"}
          label="This job is unpublished. It will not be visible in the jobs list."
        />
      )}

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* Left container */}
        <div>
          {/* Title */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-700">Customize your job</h2>
          </div>

          {/* Forms */}
          <TitleForm initialData={job} jobId={job.id} />

          <CategoryForm
            initialData={{ ...job, categoryId: job.categoryId || "" }} // Ensures categoryId is not null
            jobId={job.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />

          <ImageForm initialData={job} jobId={job.id} />
          <ShortDescription initialData={job} jobId={job.id} />
          <ShiftTimingForm initialData={job} jobId={job.id} />
          <HourlyRateForm initialData={job} jobId={job.id} />
          <WorkModeForm initialData={job} jobId={job.id} />
          <YearsOfExperienceForm initialData={job} jobId={job.id} />

          {/* Job Description */}
          <div className="col-span-2">
            <JobDescription initialData={job} jobId={job.id} />
          </div>
        </div>

        {/* Right container */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl text-neutral-700">Job Requirements</h2>
            </div>

            <TagsForm initialData={job} jobId={job.id} />
 {/* Company Details*/}
            
          </div>

<div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Building2} />
              <h2 className="text-xl text-neutral-700">Company Details</h2>
            </div>

 {/* Company Details*/}

            <CompanyForm
            initialData={{ ...job,companyId : job.companyId || "" }} // Ensures companyId is not null
            jobId={job.id}
            options={companies.map((company) => ({
              label: company.name,
              value: company.id,
            }))}
          />
            
          </div>

          {/*Attachments*/}
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl text-neutral-700">Job Attachments</h2>
            </div>

          {/*Attachments*/}
          <AttachmentsForm initialData={job} jobId={job.id}/>


 {/* Company Details*/}

        
            
          </div>


        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
