import { IconBadge } from " @/components/icon-badge";
import { db } from " @/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, Network } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CompanyName } from "./name-form";
import { CompanyDescriptionForm } from "./description-form";
import { CompanyLogoForm } from "./logo-form";
import { CompanySocialContactsForm } from "./social-contacts-form";
import { CompanyCoverImageForm } from "./cover-image-form";
import { CompanyOverviewForm } from "./company-overview";
import { WhyJoinUsForm } from "./why-join-us";

const CompanyEditPage = async ({ params }: { params: { companyId: string } }) => {
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;

  // Await params to avoid the error
  const { companyId } = await params; // <-- Await params here

  // Validate companyId format
  if (!validObjectIdRegex.test(companyId)) {
    return redirect("/admin/companies");
  }

  // Get user ID from Clerk
  const { userId } = await auth();
  
  if (!userId) {
    return redirect("/");
  }

  // Fetch company from database
  const company = await db.company.findUnique({
    where: {
      id: companyId, // Use companyId after awaiting params
      userId,
    },
  });

  if (!company) {
    return redirect("/admin/companies");
  }

  // Check field completeness
  const requiredFields = [
    company.name,
    company.description,
    company.logo,
    company.coverImage,
    company.mail,
    company.website,
    company.address_line_1,
    company.area,
    company.overview,
    company.whyJoinUs,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
  <Link href="/admin/companies">
    <div className="flex items-center gap-3 text-sm text-neutral-500">
      <ArrowLeft className="w-4 h-4" />
      Back
    </div>
  </Link>

  {/* Title Section */}
  <div className="flex items-center justify-between my-4">
    <div className="flex flex-col gap-y-2">
      <h1 className="text-2xl font-medium">Company Setup</h1>
      <span className="text-sm text-neutral-500">
        Complete All Fields {completionText}
      </span>
    </div>
  </div>

  {/* Two-Column Layout */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    {/* Left Section - Company Details */}
    <div>
      <div className="flex items-center gap-x-2">
        <IconBadge icon={LayoutDashboard} />
        <h2 className="text-xl text-neutral-700">Customize your Company</h2>
      </div>

      {/* Forms */}
      <CompanyName initialData={company} companyId={company.id} />
      <CompanyDescriptionForm initialData={company} companyId={company.id} />
      <CompanyLogoForm initialData={company} companyId={company.id} />
    </div>

    {/* Right Section - Social Contacts */}
    <div>
      <div className="flex items-center gap-x-2">
        <IconBadge icon={Network} />
        <h2 className="text-xl text-neutral-700">Company Socials Contact</h2>
      </div>

      <CompanySocialContactsForm initialData={company} companyId={company.id} />
      <CompanyCoverImageForm initialData={company} companyId={company.id}/>
      <div className="col-span-2">
    <CompanyOverviewForm initialData={company} companyId={company.id}/>
    </div>

<div className="col-span-2">
  <WhyJoinUsForm initialData={company} companyId={company.id}/>
</div>
    </div>
  </div>
</div>
  );
};

export default CompanyEditPage;
