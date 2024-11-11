import { db } from "@/lib/db";

export const getUsersCount = async (): Promise<number> => {
  try {
    const purchases = await db.purchase.findMany({
      distinct: ['userId'], // Get distinct user IDs
    });

    const userCount = purchases.length; // Count the number of unique users
    return userCount;
  } catch (error) {
    console.log("[GET_USERS_COUNT]", error);
    return 0;
  }
};
