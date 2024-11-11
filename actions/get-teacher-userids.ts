import { db } from "@/lib/db";

type GetTeachers = {
  courseId?: string;
};

export const getTeachers = async ({ courseId }: GetTeachers): Promise<{ courseId: string; teacherId: string; title: string; upiId: string | null }[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isTeacher: true,
        id: courseId ? { equals: courseId } : undefined, // Optional filtering by course ID
      },
      select: {
        id: true,
        userId: true,
        title: true,
        upiId: true, // Include the upiId of the course
      }
    });

    return courses.map(course => ({ courseId: course.id, teacherId: course.userId, title: course.title, upiId: course.upiId }));
  } catch (error) {
    console.log("[GET_TEACHERS]", error);
    return [];
  }
};
