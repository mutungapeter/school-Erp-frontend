
'use client'
import { useGetTeacherQuery } from "@/redux/queries/teachers/teachersApi";
import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
// import TeacherDetail from "@/src/components/teachers/assignSubjectsAndClasses";


interface DetailProps {
    params: {
      id: number;
    };
  }
const Teacher=({ params: { id } }: DetailProps)=>{
    const { data, isLoading, isSuccess, error, refetch } =
    useGetTeacherQuery(id);
    return(
       <DefaultLayout>
         {/* {data && <TeacherDetail data={data} />} */}
         <div>Teacher detail</div>
       </DefaultLayout>
    )
}
export default Teacher