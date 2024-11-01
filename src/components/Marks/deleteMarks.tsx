
import { useDeleteMarksDataMutation } from "@/redux/queries/marks/marksApi";
import { useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import Spinner from "../layouts/spinner";
interface Props {
    marksId: number;
  refetchMarks: () => void;
}
const DeleteMarkRecord = ({ marksId, refetchMarks }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteMarksData, { isLoading: deleting }] = useDeleteMarksDataMutation();
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);
  const handleDelete = async () => {
    const id = marksId;
    try {
      await deleteMarksData(id).unwrap();
      toast.success("Mark Record deleted successfully!");
      handleCloseModal();
      refetchMarks();
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
                  <IoWarningOutline className="text-red-500" size={17} />
                </div>
                <p className="lg:text-lg md:text-lg text-sm">
                  Are you sure you want to permanently delete this Marks Record ?
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-white border shadow-md  rounded-md  py-1 px-2 md:px-4 md:py-2 lg:px-4 lg:py-2 text-xs lg:text-sm md:text-sm focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-500 text-white rounded-md  py-1 px-2 md:px-4 md:py-2 lg:px-4 lg:py-2 text-xs lg:text-sm md:text-sm shadow-md focus:outline-none"
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
export default DeleteMarkRecord;
