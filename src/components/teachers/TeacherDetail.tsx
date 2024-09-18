interface Props {
  data: any;
}
import { MdAccountCircle } from "react-icons/md";
import Image from "next/image";
import { groupBy } from "lodash";
import EditTeacher from "./eidtTeacherSubjects";
import Spinner from "../layouts/spinner";
const TeacherDetails = ({ data}: Props) => {
  console.log("data", data);
  const groupedSubjects = groupBy(data?.subjects, (s) => s.subject.subject_name);
  console.log("groupedsubjects", groupedSubjects)
  return (
    <div className="lg:mt-[110px] sm:mt-[110px] mt-[53px] ">
      <div className=" bg-white rounded-md w-full py-2 lg:py-5 md:py-5 shadow-sm">
   
        <div className="w-full border-b flex p-4 justify-between">
          <h2 className="font-semibold text-primary text-xs md:text-lg lg:text-lg">
            {data?.user?.first_name} {data?.user?.last_name} - {data?.staff_no}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-4 p-3">
          <div className="bg-white overflow-hidden col-span-2 shadow rounded-lg  border self-start  ">
            <div className="p-3 sm:px-6 bg-light">
              <Image
                src="/profile.png"
                alt={data?.user?.first_name}
                height={50}
                width={50}
              />
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {data?.user?.first_name} {data?.user?.last_name}
                </h3>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <div className="sm:divide-y sm:divide-gray-200">
                <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <div className="text-sm font-medium text-gray-500">
                    Full name
                  </div>
                  <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {data?.user?.first_name} {data?.user?.last_name}
                  </div>
                </div>
                <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <div className="text-sm font-medium text-gray-500">
                    Email address
                  </div>
                  <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {data?.user?.email}
                  </div>
                </div>
                <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <div className="text-sm font-medium text-gray-500">
                    Phone number
                  </div>
                  <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {data?.user?.phone_number}
                  </div>
                </div>
                <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <div className="text-sm font-medium text-gray-500">
                    Staff number
                  </div>
                  <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {data?.staff_no}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=" w-full col-span-3 relative p-3 rounded-md border overflow-x-auto  ">
            <div className="flex items-center justify-between py-2">
              <h2 className="text-primary font-semibold text-xs md:text-sm lg:text-sm">
                Assigned subjects and classes
              </h2>
              <EditTeacher  teacher_id={data?.id}/>
            </div>
            <table className="w-full    bg-white text-sm border text-left rounded-md rtl:text-right text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Classes
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(groupedSubjects).map((subject, index) => (
                  <tr key={index} className="bg-white border-b">
                    <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                      {subject}
                    </td>
                    <td className="px-6 py-2 font-medium text-gray-500 whitespace-nowrap">
                    {groupedSubjects[subject]
                        .map((s) => `${s.class_level.form_level.name}${s.class_level.stream ? ` ${s.class_level.stream.name}` : ''}`)
                        .join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
