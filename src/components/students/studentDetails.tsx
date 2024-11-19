import { usePermissions } from "@/src/hooks/hasAdminPermission";
import AssignElectives from "./assignElectives";
import UpdateElectives from "./updateElectives";
import { useGetStudentPerformanceQuery } from "@/redux/queries/students/studentsApi";
import StudentPerformanceChart from "../perfomance/studentPerformace";

interface Props {
  data: any;
  refetchDetails: () => void;
}

const StudentDetails = ({ data, refetchDetails }: Props) => {
  // console.log("data", data);
  const formLevel = data?.class_level?.form_level?.level;
  const subjectCount = data?.subjects?.length;
  const studentId = data?.id
  // console.log("student", studentId)
  const { hasAdminPermissions, hasClassMasterPermissions } = usePermissions();
  const {data:performanceData, refetch ,error, isLoading}=useGetStudentPerformanceQuery({
    id:studentId,
    term_id:data?.current_term
  })
  // console.log("performanceData", performanceData)
  return (
    <div className="  w-full ">
      <div className="w-full  flex lg:py-4 md:py-4 py-3 justify-between">
        <h2 className="font-semibold text-black text-sm md:text-lg lg:text-lg">
          {/* {data?.first_name} {data?.last_name} - {data?.admission_number} */}
        </h2>
        {(hasAdminPermissions() || hasClassMasterPermissions()) && (
          <div>
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
      <div className=" bg-white rounded-sm shadow-md ">
        <div className=" flex justify-between lg:px-4 md:px-4 px-2 py-3">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 md:space-x-4  lg:space-x-4">
              <h4 className="font-semibold text-black text-sm md:text-sm lg:tex-sm">
                Name:
              </h4>
              <h2 className="font-normal text-sm md:text-sm lg:tex-sm">
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
              <h4 className="font-semibold text-black text-xs md:text-sm lg:tex-sm">
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
        <div className="flex items-center justify-between p-2 bg-light mb-5">
            <h2 className="text-black font-semibold text-xs md:text-sm lg:text-sm uppercase">
              Subjects
            </h2>
          </div>
        <div className=" w-full  relative p-3 rounded-sm border-t overflow-x-auto  ">
         
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
              {data?.subjects?.map((subject: any, index: number) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full overflow-x-auto bg-white lg:p-3 md:p-3 p-0 shadow-md">
        <StudentPerformanceChart performanceData={performanceData} />
      </div>
    </div>
  );
};

export default StudentDetails;
