import { useCreateStreamMutation } from "@/redux/queries/streams/streamsApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FieldValues, useForm } from "react-hook-form";
import { FaPlusCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../layouts/spinner";
import "../style.css";
interface CreateStreamProps {
    refetchStreams: () => void;
}

export const CreateStream = ({ refetchStreams }: CreateStreamProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [createStream, { data, error, isSuccess }] =
  useCreateStreamMutation();
  
  const today = new Date();
  const schema = z.object({
    name: z.string().min(1, "Stream name is required"),
  
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FieldValues) => {
    const { name } = data;
    try {
      await createStream(data).unwrap();
      toast.success("Stream created successfully!");
      handleCloseModal();
      refetchStreams()
    } catch (error:any) {
     console.log(error)
      if (error?.data?.error) {
        toast.error(error.data.error);
      } else {
        toast.error("Failed to Create stream. Please try again.");
      }
    }
  };


  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
     <div
        onClick={handleOpenModal}
        className=" cursor-pointer text-center justify-center md:py-2 py-1 lg:py-2 lg:px-4 md:px-4 px-2 bg-green-700 rounded-sm  flex items-center space-x-2 "
      >
        <FaPlusCircle size={20} className="text-white   " />
        <span className=" lg:text-sm md:text-sm text-xs text-white">Add Stream</span>
      </div>

      {isOpen && (
        <div className="modal fixed z-9999 w-full h-full top-0 left-0 flex items-start justify-center">
          <div
            className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
            onClick={handleCloseModal}
          ></div>

          <div className="modal-container bg-white  w-10/12 md:max-w-3xl mx-auto rounded shadow-lg z-50 mt-10 transform transition-all">
            {isSubmitting && <Spinner />}
            <div className="modal-content py-6 text-left px-6 ">
              <div className="flex justify-between items-center pb-3">
                <p className="text-2xl font-bold text-[#1F4772]">
                 Add New Stream
                </p>
 
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            
                  <div>
                    <label
                      htmlFor="Name"
                      className="block text-gray-700 font-semibold text-sm mb-2"
                    >
                      Stream name
                    </label>
                    <input
                      type="text"
                      id="Name"
                      placeholder=" Stream name e.g White , Blue , North , East "
                      {...register("name")}
                      className="w-full py-2 px-4 rounded-md border border-blue-500 focus:outline-none"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {String(errors.name.message)}
                      </p>
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
                    disabled={isSubmitting}
                    className="bg-[#36A000] text-white rounded-md px-6 py-3 hover:bg-[#36A000] focus:outline-none"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
