
import { useDeleteFormLevelMutation } from "@/redux/queries/formlevels/formlevelsApi";
import { useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import Spinner from "../layouts/spinner";
interface Props {
    formLevelId: number;
  refetchFormLevels: () => void;
}
const DeleteFormLevel = ({ formLevelId, refetchFormLevels }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteFormLevel, { isLoading: deleting }] = useDeleteFormLevelMutation();
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);
  const handleDelete = async () => {
    const id = formLevelId;
    try {
      await deleteFormLevel(id).unwrap();
      toast.success("Form Level deleted successfully!");
      handleCloseModal();
      refetchFormLevels();
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
      <div className="relative z-9999 animate-fadeIn" aria-labelledby="modal-title" role="dialog" aria-modal="true">
 
      <div 
      onClick={handleCloseModal}
      className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" aria-hidden="true"></div>
    
      <div className="fixed inset-0 z-9999 w-screen overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
         
          <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-2xl p-4 md:p-6 lg:p-6 md:max-w-2xl">
            {deleting && <Spinner />}
            
              <div className="flex items-center space-x-6">
                <div className="p-4 rounded-full bg-red-100">
                  <IoWarningOutline className="text-red-500" size={20} />
                </div>
                <p className="lg:text-lg md:text-lg text-sm">
                  Are you sure you want to permanently delete this Form Level ?
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
        </div>
      )}
    </>
  );
};
export default DeleteFormLevel;
