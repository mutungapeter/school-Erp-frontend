"use client";
import {
  useGetTeacherQuery,
  useUpdateTeacherMutation,
} from "@/redux/queries/teachers/teachersApi";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { BiSolidEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../layouts/spinner";
import { useUpdateStudentMutation,useGetStudentQuery } from "@/redux/queries/students/studentsApi";
import { useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { useGetStreamsQuery,useGetStreamQuery, useUpdateStreamMutation } from "@/redux/queries/streams/streamsApi";
interface Props {
    streamId: number;
    refetchStreams: () => void;
}
const EditStream = ({ streamId, refetchStreams }: Props) => {
  console.log("studentId", streamId);
  const [isOpen, setIsOpen] = useState(false);
  const [updateStream, { isLoading: Updating }] = useUpdateStreamMutation();
  const { data: streamsData, isLoading: isFetching } =
  useGetStreamQuery(streamId);
  const {data: classesData, isLoading:isLoadingClasses} = useGetClassesQuery({})

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

  useEffect(() => {
    if (streamsData) {
      setValue("name", streamsData.name);
     
    }
  }, [streamsData, setValue]);

  const onSubmit = async (data: FieldValues) => {
    const id = streamId;
    try {
      await updateStream({ id, ...data }).unwrap();
      toast.success("Stream updated successfully!");
      handleCloseModal();
      refetchStreams();
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
        className=" cursor-pointer  p-1 rounded-sm bg-green-100"
        onClick={handleOpenModal}
      >
        <BiSolidEdit   size={17} className="text-green-800" />
      </div>

      {isOpen && (
         <div className="relative z-9999 animate-fadeIn" aria-labelledby="modal-title" role="dialog" aria-modal="true">
 
         <div 
         onClick={handleCloseModal}
         className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" aria-hidden="true"></div>
       
         <div className="fixed inset-0 z-9999 w-screen overflow-y-auto">
           <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-0">
            
             <div className="relative transform animate-fadeIn overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-2xl p-4 md:p-6 lg:p-6 md:max-w-2xl">
                 {isSubmitting && <Spinner />}
           
              <div className="flex justify-between items-center pb-3">
                <p className="font-semibold text-black md:text-xl text-md lg:text-xl">
                  Update Stream details
                </p>
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
                 
               
                
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-400 text-white rounded-md py-1 px-2 md:px-4 md:py-2 lg:px-4 lg:py-2 text-xs lg:text-sm md:text-sm hover:bg-gray-500 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={Updating}
                    className="bg-[#36A000] text-white rounded-md py-1 px-2 md:px-4 md:py-2 lg:px-4 lg:py-2 text-xs lg:text-sm md:text-sm hover:bg-[#36A000] focus:outline-none"
                  >
                    {Updating ? "Updating..." : "Submit"}
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
export default EditStream;
