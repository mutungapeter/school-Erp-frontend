import AssignElectives from "./assignElectives";
import UpdateElectives from "./updateElectives";

interface Props {
  data: any;
  refetchDetails: ()=> void;
}

const StudentDetails = ({ data, refetchDetails }: Props) => {
  console.log("data", data);
  const formLevel = data?.class_level?.form_level?.level;
  const subjectCount = data?.subjects?.length;
  return (
    <div className=" ">
      <div className=" bg-white rounded-md w-full py-2 lg:py-5 md:py-5 shadow-sm">
   
        <div className="w-full border-b flex p-2 justify-between">
          <h2 className="font-semibold text-black text-xs md:text-lg lg:text-lg">
            {data?.first_name} {data?.last_name} - {data?.admission_number}
          </h2>
         
          {formLevel >= 3 && subjectCount > 5 ? (
            <UpdateElectives studentsData={data} refetchDetails={refetchDetails} />
          ) : formLevel >= 3 ? (
            <AssignElectives studentId={data?.id} refetchDetails={refetchDetails} />
          ) : null}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-4 p-3">
          <div className="bg-white overflow-hidden col-span-2 shadow rounded-lg  border self-start  ">
            <div className="p-3 sm:px-6 bg-light">
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {data?.first_name} {data?.last_name}
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
                    {data?.first_name} {data?.last_name}
                  </div>
                </div>
                <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <div className="text-sm font-medium text-gray-500">
                    Admission Number
                  </div>
                  <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {data?.admission_number}
                  </div>
                </div>
                <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <div className="text-sm font-medium text-gray-500">
                    Class
                  </div>
                  <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {data?.class_level.form_level.name} {data?.class_level?.stream?.name}
                  </div>
                </div>
                <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <div className="text-sm font-medium text-gray-500">
                    KCPE MARKS
                  </div>
                  <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {data?.kcpe_marks}
                  </div>
                </div>
                <div className="py-1 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <div className="text-sm font-medium text-gray-500">
                    Gender
                  </div>
                  <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {data?.gender}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=" w-full col-span-3 relative p-3 rounded-sm border overflow-x-auto  ">
            <div className="flex items-center justify-between p-2 bg-light mb-5">
              <h2 className="text-black font-semibold text-xs md:text-sm lg:text-sm uppercase">
                Subjects
              </h2>
              
            </div>
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
                {data?.subjects?.map((subject: any, index:number) => (
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
      </div>
    </div>
  );
};

export default StudentDetails;
