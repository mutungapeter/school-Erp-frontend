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

  return (
    <div className=" space-y-5 py-5 ">
      <div className=" p-3  flex justify-between">
        <h2 className="font-semibold text-black md:text-xl text-md lg:text-xl">
           Subjects and  Classes
        </h2>
        <h2 className="font-semibold text-black text-xs md:text-lg lg:text-lg">{data?.staff_no}</h2>
      </div>
      <div className=" relative bg-white shadow-md overflow-x-auto   ">
        <table className="w-full bg-white text-sm border text-left rtl:text-right text-gray-500 ">
          <thead className="text-sm text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
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
                    .map(
                      (s) =>
                        `${s.class_level.form_level.name}${
                          s.class_level.stream
                            ? ` ${s.class_level.stream.name}`
                            : ""
                        }`
                    )
                    .join(", ")}
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
