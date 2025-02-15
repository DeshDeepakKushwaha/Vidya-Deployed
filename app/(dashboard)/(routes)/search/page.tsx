import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Categories } from "./_components/categories";
import { SearchInput } from "@/components/search-input";
import { CoursesList } from "@/components/courses-list";
import { getCourses } from "@/actions/get-courses";


interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}


const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = await auth();

  const newParams=await searchParams;
  if (!userId) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

  const courses = await getCourses({
    userId,
    ...newParams,
  });
  return (
    <>
       <div className="px-6 pt-6 md:hidden md:md-0 block">
    <SearchInput />
  </div>
  <div className="p-6 ">
  <Categories items={categories} />
  <CoursesList items={courses} />
</div>
    </>
   
  );
};

export default SearchPage;
