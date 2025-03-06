import { db } from " @/lib/db"; // ✅ Fixed Import Path
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { userId } = await auth();
    const { jobId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Job ID is missing", { status: 400 });
    }

    const job = await db.job.findUnique({
      where: { id: jobId },
      select: { savedUsers: true }, // ✅ Fetch only savedUsers to optimize query
    });

    if (!job) {
      return new NextResponse("Job Not Found", { status: 404 });
    }

    // ✅ Ensure user is not already in the savedUsers array
    const updatedSavedUsers = job.savedUsers.includes(userId)
      ? job.savedUsers // No change if already saved
      : [...job.savedUsers, userId]; // Append userId if not already saved

    // ✅ Update the job with the new savedUsers array
    const updatedJob = await db.job.update({
      where: { id: jobId },
      data: { savedUsers: updatedSavedUsers },
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error(`[JOB_PUBLISH_PATCH] Error:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
