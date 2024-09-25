"use client";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { useGetStreamsQuery } from "@/redux/queries/streams/streamsApi";
import { useGetStudentsBySubjectAndClassQuery } from "@/redux/queries/students/studentsApi";
import { useGetSubjectsQuery } from "@/redux/queries/subjects/subjectsApi";
import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { LuBookOpenCheck } from "react-icons/lu";
import { TbDatabaseOff } from "react-icons/tb";
interface Subject {
  id: number;
  subject_name: string;
  subject_type: string;
}
interface ClassLevel {
  id: number;
  name: string;
  stream_count: number;
}
interface Stream {
  id: number;
  name: string;
  class_level: number;
}
interface StudentInterface {
  id: number;
  student: {
    id: number;
    first_name: string;
    last_name: string;
    class_level: {
      id: number;
      name: string;
      stream_count: number;
    };
  };

  subject: string;
}
const GradingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const subjectId = searchParams.get("subject_id");
  const classLevelId = searchParams.get("class_level_id");
  const streamId = searchParams.get("stream_id");
  const admissionNumber = searchParams.get("admission_number");
  const [view, setView] = useState<"individual" | "group">("group");

  const {
    isLoading: loading,
    data,
    error,
    refetch,
  } = useGetStudentsBySubjectAndClassQuery(
    {
      subject_id: subjectId,
      class_level_id: classLevelId,
      stream_id: streamId,
      admission_number: admissionNumber,
    },
    { skip: false }
  );
  console.log("error", error);
  const {
    isLoading: loadingClasses,
    data: classesData,
    refetch: refetchClasses,
  } = useGetClassesQuery({}, { refetchOnMountOrArgChange: true });
  const {
    isLoading: loadingStreams,
    data: streamsData,
    refetch: refetchStreams,
  } = useGetStreamsQuery({}, { refetchOnMountOrArgChange: true });
  const {
    isLoading: loadingSubjects,
    data: subjectsData,
    refetch: refetchSubjects,
  } = useGetSubjectsQuery({}, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (!loading && refetch) {
      if (admissionNumber) {
        refetch();
      } else if (subjectId && classLevelId && streamId) {
        refetch();
      } else if (subjectId && classLevelId) {
        refetch();
      }
    }
    if (classLevelId && refetchStreams && !loadingStreams) {
      refetchStreams();
    }
  }, [
    subjectId,
    classLevelId,
    streamId,
    admissionNumber,
    loading,
    loadingStreams,
    loadingClasses,
    loadingSubjects,
    refetchStreams,

    refetch,
  ]);

  const studentsData = data && data.length > 0 ? data : null;

  const handleSelectChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);

    if (name === "class_level_id") {
      const selectedClass = classesData.find(
        (classLevel: ClassLevel) => classLevel.id === Number(value)
      );
      if (selectedClass && selectedClass.stream_count === 0) {
        params.delete("stream_id");
      }
    }
    router.push(`?${params.toString()}`);
  };
  const filteredStreams = useMemo(() => {
    return streamsData?.filter(
      (stream: Stream) => stream.class_level === Number(classLevelId)
    );
  }, [streamsData, classLevelId]);

  const handleViewChange = (newView: "individual" | "group") => {
    const params = new URLSearchParams(searchParams.toString());

    if (newView === "individual") {
      params.delete("class_level_id");
      params.delete("subject_id");
      params.delete("stream_id");
    } else if (newView === "group") {
      params.delete("admission_number");
    }

    setView(newView);
    router.push(`?${params.toString()}`);
  };

  return (
    <DefaultLayout>
      <div className="mt-[50px] sm:mt-[110px] lg:mt-[110px] flex flex-col gap-5">
        <div className="flex flex-col lg:gap-0 gap-3 lg:flex lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4  p-1 border border-[#1F4772] rounded-md  lg:w-1/3 w-full">
            <div className="bg-[#C8D9EB] p-3 rounded-full flex items-center justify-center">
              <LuBookOpenCheck color="#1F4772" size={30} />
            </div>
            <div className=" flex flex-col gap-2 ">
              <h2 className="text-[#1F4772] font-bold text-lg underline underline-offset-4 decoration-[#1F4772] decoration-3">
                Grading a student
              </h2>

              <p className="text-[13px]">
                To grade a student, you can choose to grade individually or by
                group. Select the filters as needed.
              </p>
            </div>
          </div>
          <div className="flex justify-between lg:justify-none lg:space-x-5 mb-4">
            <button
              onClick={() => handleViewChange("group")}
              className={`lg:py-2 lg:px-4 p-2 rounded-md border text-[13px] lg:text-lg ${
                view === "group"
                  ? "bg-[#1F4772] text-white"
                  : "bg-white text-[#1F4772]"
              }`}
            >
              Grade Group
            </button>
            <button
              onClick={() => handleViewChange("individual")}
              className={`lg:py-2 lg:px-4 p-2 text-[13px] lg:text-lg  rounded-md border ${
                view === "individual"
                  ? "bg-[#1F4772] text-white"
                  : "bg-white text-[#1F4772]"
              }`}
            >
              Grade Individual
            </button>
          </div>
        </div>
        {view === "individual" ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-end">
              <input
                type="text"
                name="admission_number"
                value={admissionNumber || ""}
                onChange={handleSelectChange}
                placeholder="Find by Admission Number"
                className="w-64  py-2 px-4 rounded-md border border-[#1F4772] focus:outline-none focus:bg-white"
              />
            </div>
            <div className="relative overflow-x-auto rounded-md">
              <table className="w-full bg-white text-sm border text-left rounded-md rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Class
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={4} className=" py-4">
                        <div className="flex items-center justify-center space-x-6 text-#1F4772">
                          <TbDatabaseOff size={25} />
                          <span>
                            {(error as any).data.error || "No data to show"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : data && data.length > 0 ? (
                    data.map((std: StudentInterface, index: number) => (
                      <tr key={std.id} className="bg-white border-b">
                        <th className="px-6 py-4 text-gray-900">{index + 1}</th>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {std.student.first_name} {std.student.last_name}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {std.student.class_level?.name}
                        </td>
                        <td className="px-6 py-4 flex items-center space-x-5">
                          <h2 className="p-2 rounded-md text-white bg-[#1F4772]">
                            Grade
                          </h2>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row lg:items-center lg:justify-end lg:space-x-5  ">
              <select
                name="subject_id"
                value={subjectId || ""}
                onChange={handleSelectChange}
                className="w-64  py-2 px-4 rounded-md border border-[#1F4772] focus:outline-none focus:bg-white"
              >
                <option value="">Select Subject</option>
                {subjectsData?.map((subject: Subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subject_name}
                  </option>
                ))}
              </select>
              <select
                name="class_level_id"
                value={classLevelId || ""}
                onChange={handleSelectChange}
                className="w-64  py-2 px-4 rounded-md border border-[#1F4772] focus:outline-none focus:bg-white"
              >
                <option value="">Select Class Level</option>
                {classesData?.map((classLevel: ClassLevel) => (
                  <option key={classLevel.id} value={classLevel.id}>
                    {classLevel.name}
                  </option>
                ))}
              </select>
              <select
                name="stream_id"
                value={streamId || ""}
                onChange={handleSelectChange}
                className="w-64  py-2 px-4 rounded-md border border-[#1F4772] focus:outline-none focus:bg-white"
                disabled={!classLevelId || !filteredStreams?.length}
              >
                <option value="">
                  {filteredStreams && filteredStreams.length > 0
                    ? "Select Stream"
                    : "No Streams"}
                </option>
                {filteredStreams?.map((stream: Stream) => (
                  <option key={stream.id} value={stream.id}>
                    {stream.name}
                  </option>
                ))}
              </select>
            </div>
            <div className=" relative overflow-x-auto rounded-md">
              <table className="w-full bg-white text-sm border text-left rounded-md rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase border-b bg-gray-50 rounded-t-md">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Subject
                    </th>

                    <th scope="col" className="px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={4} className=" py-4">
                        <div className="flex items-center justify-center space-x-6 text-#1F4772">
                          <TbDatabaseOff size={25} />
                          <span>
                            {(error as any).data.error || "No data to show"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : studentsData && data.length > 0 ? (
                    studentsData?.map(
                      (std: StudentInterface, index: number) => (
                        <tr key={std.id} className="bg-white border-b">
                          <th className="px-6 py-4 text-gray-900">
                            {index + 1}
                          </th>
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {std.student.first_name} {std.student.last_name}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {std.subject}
                          </td>

                          <td className="px-6 py-4 flex items-center space-x-5">
                            <h2 className="p-2 rounded-md text-white bg-[#1F4772]">
                              Grade
                            </h2>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        {studentsData?.length === 0 || !studentsData
                          ? "No students found."
                          : "No subjects found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};
export default GradingPage;
