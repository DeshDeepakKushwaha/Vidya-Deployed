import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";
export const getAnalytics = async () => {
  try {
    const purchases = await db.purchase.findMany({
      include: {
        course: true,
      }
    });

    const groupedData: {[courseTitle: string]: {lifetimeSales: number, revenue: number}} = {};

    purchases.forEach(purchase => {
      const courseTitle = purchase.course.title;
      if (!groupedData[courseTitle]) {
        groupedData[courseTitle] = { lifetimeSales: 0, revenue: 0 };
      }
      groupedData[courseTitle].lifetimeSales += 1; // Increment sales count
      groupedData[courseTitle].revenue += purchase.course.price || 0; // Add to revenue
    });

    const data = Object.entries(groupedData).map(([courseTitle, { lifetimeSales, revenue }]) => ({
      name: courseTitle,
      lifetimeSales,
      revenue,
    }));

    const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalSales = purchases.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};



export const getAnalyticsMonth = async () => {
  try {
    const purchases = await db.purchase.findMany({
      include: {
        course: true,
      }
    });

    const groupedData: {[month: string]: { lifetimeSales: number, revenue: number }} = {};

    purchases.forEach(purchase => {
      const purchaseMonth = new Date(purchase.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!groupedData[purchaseMonth]) {
        groupedData[purchaseMonth] = { lifetimeSales: 0, revenue: 0 };
      }
      groupedData[purchaseMonth].lifetimeSales += 1; // Increment sales count
      groupedData[purchaseMonth].revenue += purchase.course.price || 0; // Add to revenue
    });

    const data = Object.entries(groupedData).map(([month, { lifetimeSales, revenue }]) => ({
      month,
      lifetimeSales,
      revenue,
    }));

    const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalSales = purchases.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};