import { usePermissions } from "@/src/hooks/hasAdminPermission";
import AssignElectives from "./assignElectives";
import UpdateElectives from "./updateElectives";
import {
  useGetStudentPerformanceQuery,
  useGetStudentQuery,
} from "@/redux/queries/students/studentsApi";
import StudentPerformanceChart from "../perfomance/studentPerformace";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";

import { ClassLevel } from "@/src/definitions/classlevels";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import {
  useDeleteClassLevelsMutation,
  useGetClassesQuery,
} from "@/redux/queries/classes/classesApi";
import ContentSpinner from "../perfomance/contentSpinner";
interface StudentDetailsProps {
  student_id: number;
}

const StudentDetails = ({ student_id }: StudentDetailsProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialFilters = useMemo(
    () => ({
      class_level_id: searchParams.get("class_level_id") || "",
    }),
    [searchParams]
  );
  const [filters, setFilters] = useState(initialFilters);
  const {
    data,
    isLoading: isLoadingStudent,
    isSuccess,
    error: isErrorLoadingStudent,
    refetch: refetchStudent,
  } = useGetStudentQuery({
    id: student_id,
    class_level_id: filters.class_level_id,
  });
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.class_level_id) {
      params.set("class_level_id", filters.class_level_id);
    }

    router.replace(`?${params.toString()}`);
  }, [filters]);
console.log(
  "isErrorLoadingStudent",isErrorLoadingStudent
)
  console.log("data", data);
  const formLevel = data?.class_level?.form_level?.level;
  const subjectCount = data?.subjects?.length;
  const studentId = data?.id;
  // console.log("student", studentId)
  const { hasAdminPermissions, hasClassMasterPermissions } = usePermissions();
  const {
    data: performanceData,
    refetch,
    error:errorLoadingPerformance,
    isLoading:isLoadingPerformance,
  } = useGetStudentPerformanceQuery({
    id: studentId,
    term_id: data?.current_term,
  });
  const {
    isLoading: loadingClasses,
    data: classesData,
    refetch: refetchClasses,
  } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });
  // console.log("performanceData", performanceData)
  const refetchDetails = () => {
    refetchStudent();
  };
  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  if (isLoadingStudent) {
    return (
      <PageLoadingSpinner />
    );
  }
  return (
    <div className="space-y-5  py-2  ">
      <div className="flex lg:flex-row md:flex-row flex-col md:space-y-0 lg:space-0 space-y-3 lg:py-4 md:py-4 py-3 justify-between">
        <h2 className="font-semibold text-black text-md md:text-lg lg:text-lg">
          Student details
        </h2>
        <div className="flex items-center space-x-5 justify-between ">
          <div className="relative w-34 lg:w-48 md:w-48 xl:w-48  ">
            <select
              name="class_level_id"
              value={filters.class_level_id || ""}
              onChange={handleFilterChange}
              className="w-34 lg:w-48 md:w-48 xl:w-48
             appearance-none py-2 px-4
               text-[10px] md:text-xs lg:text-xs font-semibold rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
            >
              <option value="">Filter by class</option>
              {classesData?.map((classLevel: ClassLevel) => (
                <option key={classLevel.id} value={classLevel.id}>
                  {classLevel.form_level.name} {classLevel?.stream?.name}
                </option>
              ))}
            </select>
            <BsChevronDown
              color="gray"
              size={20}
              className="absolute top-[50%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
            />
          </div>
          {(hasAdminPermissions() || hasClassMasterPermissions()) && (
            <div className="flex inline-flex">
              {formLevel >= 3 && subjectCount > 5 ? (
                <UpdateElectives
                  studentsData={data}
                  refetchDetails={refetchDetails}
                />
              ) : formLevel >= 3 ? (
                <AssignElectives
                  studentId={data?.id}
                  refetchDetails={refetchDetails}
                />
              ) : null}
            </div>
          )}
        </div>
      </div>
      <div className=" bg-white rounded-sm shadow-md ">
        <div className=" flex justify-between lg:px-4 md:px-4 px-2 py-3">
          <div className="space-y-2">
            <div className="flex items-center space-x-1 md:space-x-4  lg:space-x-4">
              <h4 className="font-semibold text-black text-sm md:text-sm lg:tex-sm">
                Name:
              </h4>
              <h2 className="font-normal text-xs md:text-sm lg:tex-sm">
                {data?.first_name} {data?.last_name}
              </h2>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4  lg:space-x-4">
              <h4 className="font-semibold text-black text-xs md:text-sm lg:tex-sm">
                Gender:
              </h4>
              <h2 className="font-normal text-xs md:text-sm lg:tex-sm">
                {data?.gender}
              </h2>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4  lg:space-x-4">
              <h4 className="font-semibold  text-black text-sm md:text-sm lg:tex-sm">
                Kcpe Marks:
              </h4>
              <h2 className="font-normal text-sm md:text-sm lg:tex-sm">
                {data?.kcpe_marks}
              </h2>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 md:space-x-4  lg:space-x-4">
              <h4 className="font-semibold text-black text-sm md:text-sm lg:tex-sm">
                Adm No:
              </h4>
              <h2 className="font-normal text-sm md:text-sm lg:tex-sm">
                {data?.admission_number}
              </h2>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4  lg:space-x-4">
              <h4 className="font-semibold text-black text-xs md:text-sm lg:tex-sm">
                Class:
              </h4>
              <h2 className="font-normal  text-xs md:text-sm lg:tex-sm">
                {data?.class_level.form_level.name}{" "}
                {data?.class_level?.stream?.name}
              </h2>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between py-3 px-3 bg-light border-t">
          <h2 className="text-black font-semibold text-xs md:text-sm lg:text-sm uppercase">
            Subjects
          </h2>
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
            {isLoadingStudent ? (
              
              <div className="flex justify-center items-center py-6">
              <ContentSpinner /> 
            </div>
              ) : isErrorLoadingStudent ? (
                <tr>
                  <td colSpan={8} className=" py-4">
                    <div className="flex items-center justify-center space-x-6 font-semibold text-sm md:text-md lg:text-md text-red-500">
                      
                      <span>
                        {(isErrorLoadingStudent as any)?.data?.error || "No data to show"}
                      </span>
                    </div>
                  </td>
                </tr>
              ) :data && data.subjects.length > 0 ? (

              
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
      <div className="w-full overflow-x-auto bg-white lg:p-3 md:p-3 p-0 shadow-md">
      {isLoadingPerformance ? (
          <div className="flex justify-center items-center py-6">
            <ContentSpinner /> 
          </div>
        ) : (
          <StudentPerformanceChart performanceData={performanceData} />
        )}
        
      </div>
    </div>
  );
};

export default StudentDetails;
