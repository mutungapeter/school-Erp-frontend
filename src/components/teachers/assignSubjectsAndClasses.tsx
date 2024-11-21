"use client";
import { useGetSubjectsQuery } from "@/redux/queries/subjects/subjectsApi";
import { useAssignTeacherToSubjectsAndClassesMutation } from "@/redux/queries/teachers/teachersApi";
import { useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../layouts/spinner";
import { MdOutlineClose } from "react-icons/md";
interface Props {
  teacher_id: number;
}

const AssignTeacher = ({ teacher_id }: Props) => {
  // console.log("id", teacher_id)
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subjectClasses, setSubjectClasses] = useState<{
    [key: number]: number[];
  }>({});

  const {
    isLoading: loadingSubjects,
    data: subjectsData,
    refetch: refetchSubjects,
  } = useGetSubjectsQuery({}, { refetchOnMountOrArgChange: true });
console.log("subjectsData", subjectsData)
  const [assignTeacherToSubjectsAndClasses, { data, error, isSuccess }] =
    useAssignTeacherToSubjectsAndClassesMutation();

  const handleSubjectChange = (subjectId: number) => {
    setSubjectClasses((prev) => {
      const updated = { ...prev };
      if (updated[subjectId]) {
        delete updated[subjectId];
      } else {
        updated[subjectId] = [];
      }
      return updated;
    });
  };

  const handleClassChange = (subjectId: number, classId: number) => {
    setSubjectClasses((prev) => {
      const updated = { ...prev };
      if (updated[subjectId]) {
        if (updated[subjectId].includes(classId)) {
          updated[subjectId] = updated[subjectId].filter(
            (id) => id !== classId
          );
        } else {
          updated[subjectId] = [...updated[subjectId], classId];
        }
      }
      return updated;
    });
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedSubjects = Object.keys(subjectClasses).map((subjectId) => ({
      subject: Number(subjectId),
      classes: subjectClasses[Number(subjectId)],
    }));

    const formData = {
      teacher: teacher_id,
      subjects: formattedSubjects,
    };
    console.log("formData", formData)

    try {
      setIsLoading(true);
      const response = await assignTeacherToSubjectsAndClasses(formData).unwrap();
      const successMessage = response?.message || "Request successful";
      toast.success(successMessage);
      setIsLoading(false);
      handleCloseModal();
    } catch (error: any) {
      setIsLoading(false);
      if (error?.data?.error) {
        console.log("error", error)
        toast.error(error.data.error);
      } else {
        toast.error("Failed to assign subjects and classes. Please try again.");
      }
    }

    setSubjectClasses({});
  };

  const isClassChecked = (subjectId: number, classId: number) => {
    return subjectClasses[subjectId]?.includes(classId) || false;
  };
// [#1F4772]
  return (
    <>
      <div
        onClick={handleOpenModal}
        className="py-1 px-2 rounded-md bg-primary text-white text-sm cursor-pointer text-center"
      >
        Assign subjects
      </div>
      {isOpen && (
         <div className="relative z-9999 animate-fadeIn" aria-labelledby="modal-title" role="dialog" aria-modal="true">
 
         <div 
         onClick={handleCloseModal}
         className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" aria-hidden="true"></div>
       
         <div className="fixed inset-0 z-9999 w-screen overflow-y-auto">
           <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
            
             <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl  sm:my-8  w-full sm:max-w-2xl  md:max-w-2xl">
               {isLoading && <Spinner />}
            
           
              <div className="sticky top-0 bg-white z-10  text-left p-2  md:p-4 lg:p-4 shadow-sm border">
              <div className="flex justify-between items-center pb-3">
                <p className="lg:text-2xl md:text-2xl text-sm font-semibold text-black">
                Assign Teacher to Subjects and Classes
                </p>
                <MdOutlineClose
                  onClick={handleCloseModal}
                  size={30}
                  stroke="5"
                  className="cursor-pointer font-bold text-primary"
                />
              </div>
            </div>
              <form
                onSubmit={handleSubmit}
                className="w-full h-full space-y-5 mt-4"
              >
                <div className=" py-2 text-left px-6 z-9999 overflow-y-auto max-h-[70vh]">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {subjectsData?.map((subject: any) => (
                    <div key={subject.id} className="mb-6">
                      <div>
                        <input
                          type="checkbox"
                          id={`subject-${subject.id}`}
                          checked={!!subjectClasses[subject.id]}
                          onChange={() => handleSubjectChange(subject.id)}
                        />
                        <label
                          htmlFor={`subject-${subject.id}`}
                          className="ml-2 font-semibold"
                        >
                          {subject.subject_name}
                        </label>
                      </div>

                      {/* Classes for each subject */}
                      {subjectClasses[subject.id] && (
                        <div className="ml-4 mt-2">
                          {subject.class_levels.map((classData: any) => (
                            <div key={classData.id} className="mb-2">
                              <input
                                type="checkbox"
                                id={`class-${subject.id}-${classData.id}`}
                                checked={isClassChecked(
                                  subject.id,
                                  classData.id
                                )}
                                onChange={() =>
                                  handleClassChange(subject.id, classData.id)
                                }
                              />
                              <label
                                htmlFor={`class-${subject.id}-${classData.id}`}
                                className="ml-2"
                              >
                                {classData?.form_level?.name}{" "}
                                {classData?.stream?.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                </div>
                <div className="sticky bottom-0 p-2  md:p-4 lg:p-4  bg-white z-10 border">
                <div className="flex justify-between mt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-400 text-white rounded-md py-2 px-3 md:px-6 md:py-3 lg:px-6 lg:py-3 hover:bg-gray-500 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#36A000] text-white rounded-md py-2 px-3 md:px-6 md:py-3 lg:px-6 lg:py-3 hover:bg-[#36A000] focus:outline-none"
                  >
                    {isLoading ? "Submitting..." : "Submit"}
                  </button>
                </div>
                </div>
              </form>
            
          </div>
        </div>
        </div>
        </div>
      )}
    </>
  );
};

export default AssignTeacher;
