
'use client'
import { useGetTeacherQuery } from "@/redux/queries/teachers/teachersApi";
import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import TeacherDetails from "@/src/components/teachers/TeacherDetail";

interface DetailProps {
    params: {
      id: number;
    };
  }
const Teacher=({ params: { id } }: DetailProps)=>{
    const { data, isLoading, isSuccess, error, refetch } =
    useGetTeacherQuery(id);
    console.log("data", data)
    return(
       <DefaultLayout>
         {data && <TeacherDetails data={data} />}
        
       </DefaultLayout>
    )
}
export default Teacher