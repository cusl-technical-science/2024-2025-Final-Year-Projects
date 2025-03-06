import { db } from " @/lib/db";  // ✅ Fixed spacing issue
import { auth } from "@clerk/nextjs/server";
import { Job } from "@prisma/client";

type GetJobs = {
  title?: string;
  categoryId?: string;
  createdAtFilter?: string;
  shiftTiming?: string;
  workMode?: string;
  yearsOfExperience?: string;
  savedJobs?: boolean;
};

export const getJobs = async ({
  title,
  categoryId,
  createdAtFilter,
  shiftTiming,
  workMode,
  yearsOfExperience,
  savedJobs,
}: GetJobs): Promise<Job[]> => {
  const { userId } = await auth(); // ✅ Ensure auth is awaited

  try {
    // Initialize the query object
    const query: any = {
      where: {
        isPublished: true, // ✅ Fixed typo
      },
      include: {
        company: true,
        category: true,
        attachments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    };

    // Apply title and category filters
    if (title || categoryId) {
      query.where.AND = [
        title && {
          title: {
            contains: title,
            mode: "insensitive",
          },
        },
        categoryId && {
          categoryId: {
            equals: categoryId,
          },
        },
      ].filter(Boolean);
    }

    // Filter by createdAt
    if (createdAtFilter) {
      const currentDate = new Date();
      let startDate: Date;

      switch (createdAtFilter) {
        case "today":
          startDate = new Date(currentDate);
          break;
        case "yesterday":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - 1);
          break;
        case "thisWeek":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - currentDate.getDay());
          break;
        case "lastWeek":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - currentDate.getDay() - 7);
          break;
        case "thisMonth":
          startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          break;
        default:
          startDate = new Date(0);
      }

      query.where.createdAt = {
        gte: startDate,
      };
    }

    // Filter by shift timing
    const formattedShiftTiming = shiftTiming?.split(",");
    if (formattedShiftTiming?.length) {
        query.where.shiftTiming = {
          in: formattedShiftTiming,
        };
      }

    // Filter by work mode
    const formattedWorkingMode = workMode?.split(","); // ✅ Fixed typo
    if (formattedWorkingMode?.length) {
        query.where.workMode = {
          in: formattedWorkingMode,
        };
      }

    // Filter by experience
    const formattedYOExperience = yearsOfExperience?.split(",");
    if (formattedYOExperience?.length) {
        query.where.yearsOfExperience = {
          in: formattedYOExperience,
        };
      }

    // Filter by saved jobs
    if (savedJobs) {
      query.where.savedUsers = {
        has: userId,
      };
    }

    // Execute query
    const jobs = await db.job.findMany(query);
    return jobs;
  } catch (error) {
    console.error("[GET_JOBS]:", error);
    return [];
  }
};
