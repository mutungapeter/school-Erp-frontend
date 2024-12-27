
import { useDeleteMeanGradeConfigMutation } from "@/redux/queries/gradingConfig/meanGradeConfig";
import { useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import Spinner from "../../layouts/spinner";
import Image from "next/image"
interface Props {
    refetchMeanGradeConfigs: () => void;
  meangradeConfigId:number;
}
const DeleteMeanGradeConfig = ({ meangradeConfigId, refetchMeanGradeConfigs }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteMeanGradeConfig, { isLoading: deleting }] = useDeleteMeanGradeConfigMutation();
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);
  const handleDelete = async () => {
    const id = meangradeConfigId;
    try {
      await deleteMeanGradeConfig(id).unwrap();
      toast.success("Mean grade  scale configuration deleted successfully!");
      handleCloseModal();
      refetchMeanGradeConfigs();
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
   <div className="flex min-h-full  justify-center p-4 text-center items-center sm:p-0">
   {/* <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-0 w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] p-4 md:p-6 lg:p-6 "> */}
     <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-0 w-full sm:max-w-lg p-4 md:p-6 lg:p-6 md:max-w-lg">
       {deleting && <Spinner />}
            
              <div className="p-4 flex flex-col gap-4">
               
                <p className="lg:text-lg md:text-lg text-sm font-medium">
                  Are you sure you want to permanently delete this Mean grade configuration ?
                  This action cannot be undone.
                </p>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"
                 
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
              <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={handleCloseModal}
            >
              <Image src="/icons/close.png" alt="" width={14} height={14} />
            </div>
         
          </div>
        </div>
          </div>
        </div>
      )}
    </>
  );
};
export default DeleteMeanGradeConfig;
