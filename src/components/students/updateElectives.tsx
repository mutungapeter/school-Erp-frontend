"use client";
import {
  useAssignElectiveSubjectsMutation,
  useUpdateAssignedElectiveSubjectsMutation,
} from "@/redux/queries/students/studentsApi";
import { useGetSubjectsQuery } from "@/redux/queries/subjects/subjectsApi";
import { Subject } from "@/src/definitions/ElectiveSubjects";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import Spinner from "../layouts/spinner";
import { CreateClassLevel } from "../classlevels/NewClasslevel";
import { BiSolidEdit } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
interface Props {
  studentsData: any;
  refetchDetails: () => void;
}
const UpdateElectives = ({ studentsData, refetchDetails }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedElectives, setSelectedElectives] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    isLoading: loadingSubjects,
    data: subjectsData,
    refetch,
  } = useGetSubjectsQuery({}, { refetchOnMountOrArgChange: true });
  const [updateAssignedElectiveSubjects, { data, error, isSuccess }] =
    useUpdateAssignedElectiveSubjectsMutation();

  const electives = subjectsData?.filter(
    (subject: Subject) =>
      subject.subject_type === "Elective" &&
      subject.class_levels.some(
        (classLevel) =>
          classLevel.level === 3 || classLevel.level === 4
      )
  );
  console.log("subjectsFromStudentsData", studentsData.subjects);
  const existingElectives = studentsData.subjects.filter(
    (subject: any) => subject.subject.subject_type === "Elective"
  );
  console.log("Existing Electives: ", existingElectives);

  const handleElectiveChange = (subjectId: number) => {
    setSelectedElectives((prevSelected) => {
      if (prevSelected.includes(subjectId)) {
        return prevSelected.filter((id) => id !== subjectId);
      }
      return [...prevSelected, subjectId];
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const studentId = studentsData?.id;
    const formData = {
      student_id: studentId,
      electives: selectedElectives,
    };

    try {
      setIsLoading(true);
      const response = await updateAssignedElectiveSubjects(formData).unwrap();
      const successMessage = response?.message || "Request successful";
      toast.success(successMessage);
      setIsLoading(false);
      refetchDetails();
      handleCloseModal();
    } catch (error: any) {
      setIsLoading(false);
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      }
    }
  };
  console.log("subjectsData", subjectsData);
  const handleOpenModal = () => {
    setIsOpen(true),
      setSelectedElectives(
        existingElectives.map((elective: any) => elective.subject.id)
      );
  };
  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
      <div
        onClick={handleOpenModal}
        className=" cursor-pointer text-center justify-center    px-2 py-2 md:py-2 md:px-3 lg:py-2 lg:px-3 bg-green-700 rounded-md  flex items-center md:space-x-2 space-x-2 lg:space-x-2 "
      >
        <BiSolidEdit size={17} className="text-white" />
        <span className=" text-sm text-white">
          Update Electives
        </span>
      </div>
      {isOpen && (
        <div
          className="relative z-9999 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn"
            aria-hidden="true"
          ></div>

          <div className="fixed inset-0 z-9999 w-screen overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
              <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-2xl p-4 md:p-6 lg:p-6 md:max-w-2xl">
                {isLoading && <Spinner />}

                <div className="flex justify-between items-center pb-3">
                  <p className="text-2xl font-bold text-[#1F4772]">
                    Update Electives
                  </p>
                  <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={35}
                      onClick={handleCloseModal}
                      className=" text-gray-500 "
                    />
                  </div>
                </div>

                <form className="space-y-2" onSubmit={handleSubmit}>
                  <div>
                    {loadingSubjects ? (
                      <Spinner />
                    ) : (
                      electives?.map((subject: Subject) => (
                        <div
                          key={subject.id}
                          className="flex items-center space-x-5 space-y-4"
                        >
                          <input
                            type="checkbox"
                            id={`elective-${subject.id}`}
                            checked={selectedElectives.includes(subject.id)}
                            onChange={() => handleElectiveChange(subject.id)}
                          />
                          <label
                            htmlFor={`elective-${subject.id}`}
                            className="ml-2"
                          >
                            {subject.subject_name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex justify-between mt-6">
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
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default UpdateElectives;
