import React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Chart } from "./_components/chart";
import { getPublishedCoursesTitles } from "@/actions/get-courses"; // Import getCoursesTitles function
import { getCutAnalytics } from "@/actions/get-teacher-analytics-cuttoff"; // Import getAnalytics function
import { currentUser } from '@clerk/nextjs';

const AnalyticsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  
  const user = await currentUser();

  // Fetch course titles of the current user
  const courseTitles = await getPublishedCoursesTitles(userId);

  // Fetch analytics data for all courses
  const analyticsData = await getCutAnalytics();

  // Calculate total revenue and total sales
  let totalRevenue = 0;
  let totalSales = 0;

  courseTitles.forEach((title) => {
    const courseData = analyticsData.data.find((course) => course.name === title);
    if (courseData) {
      totalRevenue += courseData.revenue;
      totalSales += courseData.lifetimeSales;
    }
  });

  return ( 
    <div className="p-6">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Welcome Back! {user?.username} </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-semibold text-gray-900">Total Revenue</h2>
            <p className="mt-1 text-2xl font-semibold text-gray-900">₹{totalRevenue}</p>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-semibold text-gray-900">Total Sales</h2>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{totalSales}</p>
          </div>
        </div>
      </div>
  

      {/* Display course titles, sales count, and revenue */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Published Courses</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students Enrolled</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courseTitles.map((title, index) => {
              const courseData = analyticsData.data.find((course) => course.name === title);
              const lifetimeSales = courseData ? courseData.lifetimeSales : 0;
              const revenue = courseData ? courseData.revenue : 0;
              return (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{lifetimeSales}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{revenue}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AnalyticsPage;
