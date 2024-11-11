import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";
import { currentUser } from '@clerk/nextjs/server';

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";

import { InfoCard } from "./_components/info-card";

export default async function Dashboard() {
  const { userId } = await auth();

  // Redirect if not logged in
  if (!userId) {
    return redirect("/");
  }

  const user = await currentUser();

  // Check if the user is not signed in
  if (!user) {
    return <div>Not signed in</div>;
  }

  const {
    completedCourses,
    coursesInProgress
  } = await getDashboardCourses(userId);

  return (
    <div className="p-6 space-y-4">
      <div>
        Hey ! {user?.username} ready to start learning
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>

      <CoursesList
        items={[...coursesInProgress, ...completedCourses]}
      />
    </div>
  );
}
