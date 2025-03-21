"use client";
import { useAssignElectiveSubjectsMutation } from "@/redux/queries/students/studentsApi";
import { useGetSubjectsQuery } from "@/redux/queries/subjects/subjectsApi";
import { Subject } from "@/src/definitions/ElectiveSubjects";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import Spinner from "../layouts/spinner";
import { IoCloseOutline } from "react-icons/io5";
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
          classLevel.level === 3 || classLevel.level === 4
      )
  );
  console.log("subjectsData", subjectsData)
  console.log("electives", electives)
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
        className=" cursor-pointer text-center   p-2 bg-green-700 rounded-md  flex items-center space-x-2 "
      >
        <FaPlusCircle size={15} className="text-white" />
        <span className="md:text-sm lg:text-sm text-xs text-white">Register Electives</span>
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
                <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={35}
                      onClick={handleCloseModal}
                      className=" text-gray-500 "
                    />
                  </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {loadingSubjects ? (
                    <Spinner />
                  ) : (
                    electives?.map((subject: Subject) => (
                      <div
                        key={subject.id}
                        className="flex items-center space-x-5 "
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
             
                <div className="flex justify-start lg:justify-end md:justify-end mt-7 py-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium  text-sm space-x-4
                       text-white rounded-md  px-5 py-2"
                    >
                      
                      <span>{isLoading ? "Saving..." : "Save Electives"}</span>
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
