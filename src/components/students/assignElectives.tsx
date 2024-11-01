"use client";
import { useAssignElectiveSubjectsMutation } from "@/redux/queries/students/studentsApi";
import { useGetSubjectsQuery } from "@/redux/queries/subjects/subjectsApi";
import { Subject } from "@/src/definitions/ElectiveSubjects";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import Spinner from "../layouts/spinner";
interface Props {
  studentId: number;
  refetchDetails: () => void;
}
const AssignElectives = ({ studentId, refetchDetails }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedElectives, setSelectedElectives] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    isLoading: loadingSubjects,
    data: subjectsData,
    refetch,
  } = useGetSubjectsQuery({}, { refetchOnMountOrArgChange: true });
  const [assignElectiveSubjects, { data, error, isSuccess }] =
    useAssignElectiveSubjectsMutation();

  const electives = subjectsData?.filter(
    (subject: Subject) =>
      subject.subject_type === "Elective" &&
      subject.class_levels.some(
        (classLevel) =>
          classLevel.form_level.level === 3 || classLevel.form_level.level === 4
      )
  );
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
    console.log("Selected Electives IDs:", selectedElectives, studentId);
    const formData = {
      student_id: studentId,
      electives: selectedElectives,
    };
    if (selectedElectives.length === 0) {
      toast.error("Please select at least one subject");
      return;
    }
    try {
      setIsLoading(true);
      const response = await assignElectiveSubjects(formData).unwrap();
      const successMessage = response?.message || "Request successful";
      toast.success(successMessage);
      setIsLoading(false);
      handleCloseModal();
      refetchDetails();
    } catch (error: any) {
      setIsLoading(false);
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      }
    }
  };
  console.log("subjectsData", subjectsData);
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
      <div
        onClick={handleOpenModal}
        className=" cursor-pointer text-center justify-center  px-2 py-2 md:py-2 md:px-4 lg:py-2 lg:px-4 bg-green-700 rounded-sm  flex items-center md:space-x-2 space-x-2 lg:space-x-2 "
      >
        <FaPlusCircle size={20} className="text-white" />
        <span className="lg:text-lg md:text-lg text-xs text-white">Register Electives</span>
      </div>
      {isOpen && (
       <div className="relative z-9999 animate-fadeIn" aria-labelledby="modal-title" role="dialog" aria-modal="true">
 
       <div 
       onClick={handleCloseModal}
       className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" aria-hidden="true"></div>
     
       <div className="fixed inset-0 z-9999 w-screen overflow-y-auto">
         <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
          
           <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-2xl p-4 md:p-6 lg:p-6 md:max-w-2xl">
             {isLoading && <Spinner />}
            
              <div className="flex justify-between items-center pb-3">
              <p className="text-2xl md:text-lg lg:text-lg font-semibold text-black">
                  Register Electives
                </p>
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
                    className="bg-gray-400 text-white rounded-md px-6 py-3 hover:bg-gray-500 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#36A000] text-white rounded-md px-6 py-3 hover:bg-[#36A000] focus:outline-none"
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
export default AssignElectives;
