
import { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import Spinner from "../layouts/spinner";
import { toast } from "react-toastify";
import { IoWarningOutline } from "react-icons/io5";
import { useDeleteStudentMutation } from "@/redux/queries/students/studentsApi";
import { useDeleteConfigMutation } from "@/redux/queries/gradingConfig/gradingConfigApi";
interface Props {
    configId: number;
  refetchConfigs: () => void;
}
const DeleteConfig = ({ configId, refetchConfigs }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConfig, { isLoading: deleting }] = useDeleteConfigMutation();
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);
  const handleDelete = async () => {
    const id = configId;
    try {
      await deleteConfig(id).unwrap();
      toast.success("Subject grading scale configuration deleted successfully!");
      handleCloseModal();
      refetchConfigs();
    } catch (error: any) {
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      }
    }
  };
  return (
    <>
      <div
        className=" cursor-pointer p-1 rounded-sm bg-red-100"
        onClick={handleOpenModal}
      >
        <RiDeleteBinLine className="text-red-800" size={17} />
      </div>
      {isOpen && (
        <div className="modal fixed insert-o z-9999 w-full h-full top-0 left-0 flex items-start justify-center">
          <div
            className="modal-overlay  w-full h-full absolute w-full h-full bg-gray-900 opacity-50"
            onClick={handleCloseModal}
          ></div>

          <div className="modal-container bg-white  w-10/12 md:max-w-3xl mx-auto rounded shadow-lg z-50 mt-10 transform transition-all">
            {deleting && <Spinner />}
            <div className="modal-content py-6 text-left px-6 ">
              <div className="flex items-center space-x-6">
                <div className="p-4 rounded-full bg-red-100">
                  <IoWarningOutline className="text-red-500" size={30} />
                </div>
                <p className="text-lg">
                  Are you sure you want to permanently delete this subject grading configuration ?
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-white border shadow-md  rounded-md px-6 py-3 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-500 text-white rounded-md px-6 py-3 shadow-md focus:outline-none"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default DeleteConfig;
