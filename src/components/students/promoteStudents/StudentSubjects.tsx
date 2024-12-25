
import { ClassLevel } from "@/src/definitions/classlevels";
import {
  useDeleteClassLevelsMutation,
  useGetClassesQuery,
  useGetCLassLevelQuery,
} from "@/redux/queries/classes/classesApi";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { useGetStudentSubjectsQuery } from "@/redux/queries/students/studentsApi";
import ContentSpinner from "../../perfomance/contentSpinner";
import UpdateElectives from "../updateElectives";
import AssignElectives from "../assignElectives";
import { usePermissions } from "@/src/hooks/hasAdminPermission";
import PageLoadingSpinner from "../../layouts/PageLoadingSpinner";
import { GoArrowLeft } from "react-icons/go";
import Link from "next/link";
interface StudentDetailsProps {
    student_id: number;
  }
  
const StudentSubjects=({ student_id }: StudentDetailsProps)=>{
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialFilters = useMemo(
      () => ({
        class_level: searchParams.get("class_level") || "",
        student_id: searchParams.get("student_id") || "",
      }),
      [searchParams]
    );
    const [filters, setFilters] = useState(initialFilters);
    const {
        hasAdminPermissions,
        hasClassMasterPermissions,
        loading: loadingPermissions,
      } = usePermissions();
    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.class_level) {
          params.set("class_level", filters.class_level);
        }
    
       
    
        router.push(`?${params.toString()}`);
      }, [filters]);
     
      const {
          data,
          isLoading: isLoadingStudentSubjects,
          isSuccess,
          error: isErrorLoadingStudentSubjects,
          refetch: refetchStudentSubjects,
        } = useGetStudentSubjectsQuery({
        
            student_id: student_id,
            class_level: filters.class_level,
        });
        console.log("class_level", filters.class_level)
        const {
            isLoading: loadingClasses,
            data: classesData,
            refetch: refetchClasses,
          } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });
         const  class_level=filters.class_level
        const {
            isLoading: loadingClass,
            data: classInfo,
            refetch: refetchClass,
          } = useGetCLassLevelQuery(class_level);
          const handleFilterChange = (
            e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
          ) => {
            const { name, value } = e.target;
        
            setFilters((prev) => ({ ...prev, [name]: value }));
          };
          if (isLoadingStudentSubjects || loadingPermissions || loadingClasses) {
            return <PageLoadingSpinner />;
          }
          console.log("data", data)
          const level = classInfo?.level;
          console.log("classInfo",classInfo)
          console.log("level",level)
         
          const subjectCount = data?.subjects?.length;

          const refetchDetails = () => {
            refetchStudentSubjects();
          };
    return (
        <>
             <div className="mt-4 bg-white  rounded-md shadow-sm p-4 h-auto min-h-[400px]">
             <Link className="cursor-pointer" href={`/students/${student_id}/`}>
                <button className="inline-flex items-center space-x-2 "
                
                >
                    <GoArrowLeft size={30} className="text-blue-600 stroke-1" />
                </button>
                </Link>
            <div className="flex flex-col gap-3 lg:gap-0 md:gap-0 lg:items-center md:items-center lg:flex-row md:flex-row md:justify-between lg:justify-between p-2 bg-light mb-5">
              <h2 className="text-black font-semibold  md:text-2xl lg:text-2xl ">
                Subjects
              </h2>
              <div className="flex flex-col md:flex-row lg:flex-row lg:items-center md:items-center gap-4 md:gap-4 lg:gap-4 w-full md:w-auto">
              <div className="flex items-center self-end gap-4 ">
              {(hasAdminPermissions() || hasClassMasterPermissions()) && (
                <div className=" inline-flex">
                  {level >= 3 && subjectCount > 5 ? (
                    <UpdateElectives
                      studentsData={data}
                      refetchDetails={refetchDetails}
                    />
                  ) : level >= 3 && subjectCount === 5 ? (
                    <AssignElectives
                      studentId={data?.id}
                      refetchDetails={refetchDetails}
                    />
                  ) : null}
                </div>
              )}
              </div>
              <div className="relative w-full lg:w-56 md:w-56 xl:w-56  ">
            <select
              name="class_level"
              value={filters.class_level || ""}
              onChange={handleFilterChange}
              className="w-full lg:w-56 md:w-56 xl:w-56
             appearance-none py-2 px-4
               text-sm md:text-lg lg:text-lg font-normal rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
            >
              <option value="">---Filter by class---</option>
              {classesData?.map((classLevel: ClassLevel) => (
                <option key={classLevel.id} value={classLevel.id}>
                  {classLevel.name} {classLevel?.stream?.name} - {classLevel.calendar_year}
                </option>
              ))}
            </select>
            <BsChevronDown
              color="gray"
              size={20}
              className="absolute top-[50%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
          </div>
                </div>
             
            </div>
            <div className=" w-full  relative p-3 rounded-sm  overflow-x-auto  ">
              <table className="w-full    bg-white text-sm border text-left rounded-md rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Subject
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Subject category
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingStudentSubjects ? (
                    <div className="flex justify-center items-center py-6">
                      <ContentSpinner />
                    </div>
                  ) : isErrorLoadingStudentSubjects ? (
                    <tr>
                      <td colSpan={8} className=" py-4">
                        <div className="flex items-center justify-center space-x-6 font-semibold text-sm md:text-md lg:text-md text-red-500">
                          <span>
                            {(isErrorLoadingStudentSubjects as any)?.data?.error ||
                              "No data to show"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : data && data?.subjects.length > 0 ? (
                    data?.subjects?.map((subject: any, index: number) => (
                      <tr key={index} className="bg-white border-b">
                        <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                          {subject.subject.subject_name}
                        </td>
                        <td className="px-6 py-2 font-medium text-gray-500 whitespace-nowrap">
                          {subject.subject.subject_type}
                        </td>
                        <td className="px-6 py-2 font-medium text-gray-500 whitespace-nowrap">
                          {subject.subject.category}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        <span className="text-sm lg:text-lg md:text-lg text-red-500">
                          No data to show
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
          </div>
        </>
    )
}
export default StudentSubjects