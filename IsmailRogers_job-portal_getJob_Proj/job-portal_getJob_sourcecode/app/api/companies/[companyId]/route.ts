import { NextResponse } from "next/server";
import { db } from " @/lib/db";
import { auth } from "@clerk/nextjs/server";

export const PATCH = async (req: Request, { params }: { params: { companyId: string } }) => {
  try {
    // Get userId from Clerk authentication
    const { userId } = await auth();

    // Validate user authentication
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Validate companyId
    const { companyId } =await params;
    if (!companyId) {
      return new NextResponse("Company ID is missing", { status: 400 });
    }

    // Get updated values from the request body
    const updatedValues = await req.json();

    // Update company in the database
    const company = await db.company.update({
      where: {
        id: companyId,
        userId, // Ensures only the owner can update the company
      },
      data: updatedValues,
    });

    // Return updated company data
    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error(`[COMPANY_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
