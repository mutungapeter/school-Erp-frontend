"use client";
import { useEffect, useState } from "react";

import { useGetFormLevelQuery, useUpdateFormLevelMutation } from "@/redux/queries/formlevels/formlevelsApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { BiSolidEdit } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../layouts/spinner";
interface Props {
    formLevelId: number;
    refetchFormLevels: () => void;
}
const EditFormLevel = ({ formLevelId, refetchFormLevels }: Props) => {

  const [isOpen, setIsOpen] = useState(false);
  const [updateFormLevel, { isLoading: Updating }] = useUpdateFormLevelMutation();
  const { data: formLevelData, isLoading: isFetching } =
  useGetFormLevelQuery(formLevelId);
  

    const schema = z.object({
      name: z.string().min(1, "Form level name is required"),
      level: z.number().min(1, "level is required"),
      
    });
  

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (formLevelData) {
      setValue("name", formLevelData.name);
      setValue("level", formLevelData.level);
     
    }
  }, [formLevelData, setValue]);

  const onSubmit = async (data: FieldValues) => {
    const id = formLevelId;
    try {
      await updateFormLevel({ id, ...data }).unwrap();
      toast.success("Form Level updated successfully!");
      handleCloseModal();
      refetchFormLevels();
    } catch (error: any) {
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      }
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
      <div
        className=" cursor-pointer flex inline-flex text-white items-center space-x-1 py-1 px-2 rounded-sm bg-primary"
        onClick={handleOpenModal}
      >
        <BiSolidEdit   size={15} className="text-white" />
        <span className="text-xs">Edit</span>
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
                <p className="text-2xl font-bold text-[#1F4772]">
                  Update Form Level details
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
                      htmlFor="firstName"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                     Stream Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="Enter stream name"
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
                      htmlFor="firstName"
                      className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                    >
                     Level
                    </label>
                    <input
                      type="text"
                      id="level"
                      placeholder="Input Level e.g 1 equaling form one etc"
                      {...register("level", {valueAsNumber:true})}
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
                      disabled={Updating}
                      className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4
                       focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm space-x-4
                       text-white rounded-md  px-5 py-2"
                    >
                      {/* <LiaEdit className="text-white " size={18} /> */}
                      <span>{Updating ? "Updating..." : "Update"}</span>
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
export default EditFormLevel;
