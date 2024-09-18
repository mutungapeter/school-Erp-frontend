"use client";
import { useGetSubjectsQuery } from "@/redux/queries/subjects/subjectsApi";
import {
  useAssignTeacherToSubjectsAndClassesMutation,
  useGetTeacherSubjectsQuery,
  useUpdateTeacherSubjectsMutation,
} from "@/redux/queries/teachers/teachersApi";
import { useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../layouts/spinner";
import { usePathname } from "next/navigation";
interface Props {
  teacher_id: number;
}

const EditTeacher = ({ teacher_id }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const [subjectClasses, setSubjectClasses] = useState<{
    [key: number]: number[];
  }>({});

  const { data: existingAssignments, isLoading: loadingExisting, refetch:refetchExistingAssignments } =
    useGetTeacherSubjectsQuery(teacher_id);
  console.log("existingAssignments", existingAssignments);
  const [updateTeacherSubjects, { isLoading: updating }] =
    useUpdateTeacherSubjectsMutation();

  const {
    isLoading: loadingSubjects,
    data: subjectsData,
    refetch: refetchSubjects,
  } = useGetSubjectsQuery({}, { refetchOnMountOrArgChange: true });

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

  const handleOpenModal = async() => {
    setIsOpen(true);
    await refetchExistingAssignments();
    if (existingAssignments) {
      const initialSubjectClasses = existingAssignments.reduce(
        (acc: any, assignment: any) => {
          const { subject, class_level } = assignment;

          // Initialize the subject entry if not present
          if (!acc[subject.id]) {
            acc[subject.id] = [];
          }

          // Add the class_level.id to the subject array if not already added
          if (!acc[subject.id].includes(class_level.id)) {
            acc[subject.id].push(class_level.id);
          }

          return acc;
        },
        {}
      );

      setSubjectClasses(initialSubjectClasses);
    }
  };

  const handleCloseModal = () => setIsOpen(false);
  const isClassChecked = (subjectId: number, classId: number) => {
    return subjectClasses[subjectId]?.includes(classId) || false;
  };
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
    console.log("formData", formData);
    try {
      setIsLoading(true);
      const response = await updateTeacherSubjects(formData).unwrap();
      const successMessage = response?.message || "Update successful";
      toast.success(successMessage);
      setIsLoading(false);
      handleCloseModal();
    } catch (error: any) {
      console.log("error", error);
      setIsLoading(false);
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      } else {
        toast.error("Failed to assign subjects and classes. Please try again.");
      }
    }

    setSubjectClasses({});
  };
  const buttonText = pathname === "/teachers" ? "View subjects" : "Update";
  const modalTitle  = pathname === "/teachers" ? "Assigned Subjects .You can update these subjects from here also" : "Update Teacher's Subjects and Classes";

  return (
    <>
      <div
        onClick={handleOpenModal}
        className="py-1 px-2 rounded-md bg-[#1F4772] text-white text-sm cursor-pointer text-center"
      >
        {buttonText}
      </div>
      {isOpen && (
        <div className="modal fixed z-50 w-full h-full top-0 left-0 flex items-start justify-center">
          <div
            className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
            onClick={handleCloseModal}
          ></div>

          <div className="modal-container bg-white w-10/12 md:max-w-5xl mx-auto rounded shadow-lg z-50 mt-10 transform transition-all">
            {updating && <Spinner />}
            
            <div className="modal-content py-6 text-left px-6">
              <div className="flex justify-between items-center pb-3">
                <p className="text-2xl font-bold text-[#1F4772]">
            {modalTitle}
                </p>
              </div>
              {loadingExisting ? (
                // <Spinner />
                <div>Loading...</div>
              ) : (
              <form
                onSubmit={handleSubmit}
                className="w-full h-full space-y-5 mt-4"
              >
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
                                {classData.form_level.name}{" "}
                                {classData?.stream?.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-400 text-white rounded-md px-6 py-3 hover:bg-gray-500 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#36A000] text-white rounded-md px-6 py-3 hover:bg-[#36A000] focus:outline-none"
                  >
                    {isLoading ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditTeacher;
