import { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import Spinner from "../layouts/spinner";
import { toast } from "react-toastify";
import { IoWarningOutline } from "react-icons/io5";
import { useDeleteAdminMutation } from "@/redux/queries/users/usersApi";
import Image from "next/image"
interface Props {
    accountId: number;
  refetchUsers: () => void;
}
const DeleteAccount = ({ accountId, refetchUsers }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteAdmin, { isLoading: deleting }] = useDeleteAdminMutation();
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);
  const handleDelete = async () => {
    const id = accountId;
    try {
      await deleteAdmin(id).unwrap();
      toast.success("Account Deleted successfully!");
      handleCloseModal();
      refetchUsers();
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
           <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            
             <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all  w-full sm:max-w-lg p-4 md:p-6 lg:p-6 md:max-w-lg">
              {deleting && <Spinner />}
           
              <div className="p-4 flex flex-col gap-4">
              <p className="lg:text-lg md:text-lg text-sm">
                  Are you sure you want to permanently delete this Admin account ?
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
export default DeleteAccount;
