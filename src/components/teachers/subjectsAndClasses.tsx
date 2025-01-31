interface Props {
  data: any;
}
import { MdAccountCircle } from "react-icons/md";
import Image from "next/image";
import { groupBy } from "lodash";
import EditTeacher from "./eidtTeacherSubjects";
import Spinner from "../layouts/spinner";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import EditTeacherSubjects from "./eidtTeacherSubjects";
import {
  useGetTeacherQuery,
  useGetTeachersQuery,
} from "@/redux/queries/teachers/teachersApi";
import DefaultLayout from "../adminDashboard/Layouts/DefaultLayout";
import PageLoadingSpinner from "../layouts/PageLoadingSpinner";
import { useEffect } from "react";
const TeacherSubjectsAndClasses = () => {
  const { user, loading } = useAppSelector((state: RootState) => state.auth);
  const userId = user?.user_id;

  const { data, isLoading, isSuccess, error, refetch } = useGetTeachersQuery(
    {},
    { refetchOnMountOrArgChange: false }
  );

  console.log("data", data);

  if (isLoading) {
    return (
      <>
        <PageLoadingSpinner />
      </>
    );
  }
  const groupedSubjects = groupBy(
    data?.subjects,
    (s) => s.subject.subject_name
  );
  const classSubjectsMap = new Map();

  // Process the data to group subjects by class
  data?.[0]?.subjects.forEach((subject: any) => {
    const className = subject.class_level.name;
    const subjectName = subject.subject.subject_name;
    
    if (!classSubjectsMap.has(className)) {
      classSubjectsMap.set(className, new Set());
    }
    classSubjectsMap.get(className).add(subjectName);
  });

  return (
    <div className=" space-y-5 py-5 bg-white shadow-md rounded-md ">
      <div className=" p-3  flex justify-between">
        <h2 className="font-semibold text-black md:text-xl text-md lg:text-xl">
          My  Subjects 
        </h2>
    
      </div>
      <div className=" relative overflow-x-auto   ">
        <table className="w-full bg-white text-sm border text-left rtl:text-right text-gray-500 ">
          <thead className="text-sm text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
            <tr>
              <th scope="col" className="px-6 py-3">
                Class
              </th>
              <th scope="col" className="px-6 py-3">
                Subjects
              </th>
            </tr>
          </thead>
          <tbody>
            
            {Array.from(classSubjectsMap).map(([className, subjects]) => (
              <tr key={className} className="bg-white border-b">
                <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                  {className}
                </td>
                <td className="px-6 py-2 font-medium text-gray-500 whitespace-nowrap">
                  {Array.from(subjects).join(", ")}
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherSubjectsAndClasses;
