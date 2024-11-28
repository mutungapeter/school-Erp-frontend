import { useCreateFormLevelMutation } from "@/redux/queries/formlevels/formlevelsApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FieldValues, useForm } from "react-hook-form";
import { FaPlusCircle } from "react-icons/fa";

import { z } from "zod";
import Spinner from "../layouts/spinner";
import "../style.css";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { GoPlus } from "react-icons/go";
interface CreateFormLevelsProps {
  refetchFormLevels: () => void;
}

export const CreateFormLevel = ({ refetchFormLevels }: CreateFormLevelsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [createFormLevel, { data, error, isSuccess }] =
  useCreateFormLevelMutation();
  
  const today = new Date();
  const schema = z.object({
    name: z.string().min(1, "Form naame is required"),
    level: z.string().min(1, "Level is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FieldValues) => {
    const { name, level } = data;
    try {
      await createFormLevel(data).unwrap();
      toast.success("Form Level created successfully!");
      handleCloseModal();
      refetchFormLevels()
    } catch (error:any) {
     
      if (error?.data?.error) {
        toast.error(error.data.error);
      } else {
        toast.error("Failed to Create Form Level. Please try again.");
      }
    }
  };


  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <>
       <div
        onClick={handleOpenModal}
        className=" cursor-pointer text-center justify-center md:py-2 py-1 lg:py-2 lg:px-3 md:px-3 px-2 bg-green-700 rounded-md  flex items-center space-x-2 "
      >
        <GoPlus size={18} className="text-white   " />
        <span className=" lg:text-sm md:text-sm text-xs  text-white">Add Form Level</span>
      </div>

      {isOpen && (
       <div className="relative z-9999 animate-fadeIn" aria-labelledby="modal-title" role="dialog" aria-modal="true">
 
       <div 
       onClick={handleCloseModal}
       className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" aria-hidden="true"></div>
     
       <div className="fixed inset-0 z-9999 w-screen overflow-y-auto">
         <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
          
           <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg p-4 md:p-6 lg:p-6 md:max-w-lg">
            {isSubmitting && <Spinner />}
            
              <div className="flex justify-between items-center pb-3">
              <p className="text-sm md:text-lg lg:text-lg font-semibold text-black">
                 Add New Form Level
                </p>
                <div className="flex justify-end cursor-pointer">
                    <IoCloseOutline
                      size={35}
                      onClick={handleCloseModal}
                      className=" text-gray-500 "
                    />
                  </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            
                  <div>
                    <label
                      htmlFor="Name"
                    className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="Name"
                      placeholder="name e.g Form One , Form Two"
                      {...register("name")}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {String(errors.name.message)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="Level"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                     Level
                    </label>
                    <input
                      type="number"
                      id="Level"
                      placeholder="Enter level e.g 1 for Form One "
                      {...register("level")}
                      className="w-full py-2 px-4 rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    />
                    {errors.level && (
                      <p className="text-red-500 text-sm">
                        {String(errors.level.message)}
                      </p>
                    )}
                  </div>
                
           
              
                <div className="flex justify-start lg:justify-end md:justify-end mt-7 py-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm space-x-4
                       text-white rounded-md  px-5 py-2"
                    >
                      {/* <LiaEdit className="text-white " size={18} /> */}
                      <span>{isSubmitting ? "Saving..." : "Save Form Level"}</span>
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
