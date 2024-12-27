import Image from "next/image";
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  confirmationMessage: string;
  deleteMessage: string;
}
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onDelete,
  confirmationMessage,
  deleteMessage,
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;
  return (
    <>
      <div
        className="relative z-9999 animate-fadeIn"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn"
          aria-hidden="true"
        ></div>

        <div className="fixed inset-0 z-9999 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center  sm:p-0">
            <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all  w-full sm:max-w-lg p-4 md:p-6 lg:p-6 md:max-w-lg">
              <div className="space-y-6">
                <div className="p-4 flex flex-col gap-4">
                  <p className="lg:text-lg md:text-lg text-sm font-medium">
                    {confirmationMessage}
                    <p className="lg:text-lg md:text-lg text-sm font-medium">
                      {deleteMessage}
                    </p>
                  </p>
                </div>
              </div>
              <div className="flex justify-center  space-x-5 text-center mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-white border shadow-md  rounded-md  py-2 px-3 md:px-6 md:py-3 lg:px-6 lg:py-3 text-xs lg:text-sm md:text-sm focus:outline-none"
                >
                  No, Cancel
                </button>
                <button
                  onClick={onDelete}
                  //   disabled={deleting}
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4  focus:ring-red-300 rounded-md  py-2 px-3 md:px-6 md:py-3 lg:px-6 lg:py-3 text-xs lg:text-sm md:text-sm shadow-md focus:outline-none"
                >
                  Yes, I am Sure
                </button>
              </div>
              <div
                className="absolute top-4 right-4 cursor-pointer"
                onClick={onClose}
              >
                <Image src="/icons/close.png" alt="" width={14} height={14} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DeleteConfirmationModal;
