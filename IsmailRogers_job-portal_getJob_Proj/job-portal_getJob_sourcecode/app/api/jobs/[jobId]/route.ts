import { storage } from " @/config/firebase.config";
import { db } from " @/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Attachment } from "@prisma/client";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { jobId: string } }) => {
  try {
    // Directly access jobId from params without awaiting
    const { jobId } =await params;

    const { userId } = await auth(); // Get userId from Clerk

    // Log userId and jobId for debugging purposes
    console.log("User ID:", userId);
    console.log("Job ID:", jobId);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedValues = await req.json();
    console.log("Updated Values:", updatedValues); // Debugging updated values

    const job = await db.job.update({
      where: {
        id: jobId, // Use jobId to find the job
        userId,    // Ensure only the user who created the job can update it
      },
      data: {
        ...updatedValues, // Update job with new values
      },
    });

    return NextResponse.json(job); // Return the updated job
  } catch (error) {
    console.error(`[JOB_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { userId } = await auth();
    console.log("User ID:", userId); // Debugging

    const { jobId } = params;
    console.log("Job ID:", jobId); // Debugging

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Job ID is missing", { status: 400 });
    }

    const job = await db.job.findUnique({
      where: {
        id: jobId,
        userId,
      },
      include: {
        attachments: true,
      },
    });

    if (!job) {
      return new NextResponse("Job Not Found", { status: 404 });
    }

    // Delete job image from Firebase storage
    if (job.imageUrl) {
      try {
        const storageRef = ref(storage, job.imageUrl);
        await deleteObject(storageRef);
      } catch (error) {
        console.warn(`Failed to delete image: ${job.imageUrl}`, error);
      }
    }

    // Delete all attachments from Firebase storage
    if (job.attachments?.length) {
      await Promise.all(
        job.attachments.map(async (attachment: Attachment) => {
          try {
            const attachmentRef = ref(storage, attachment.url);
            await deleteObject(attachmentRef);
          } catch (error) {
            console.warn(`Failed to delete attachment: ${attachment.url}`, error);
          }
        })
      );
    }

    // Delete all attachment records from the database
    await db.attachment.deleteMany({
      where: {
        jobId,
      },
    });

    // Delete the job itself
    const deletedJob = await db.job.delete({
      where: {
        id: jobId,
        userId,
      },
    });

    return NextResponse.json(deletedJob);
  } catch (error) {
    console.error(`[JOB_DELETE]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
