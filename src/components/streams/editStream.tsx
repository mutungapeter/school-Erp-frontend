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
                  Update Stream details
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-gray-700 font-semibold text-sm mb-2"
                    >
                     Stream Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="Enter stream name"
                      {...register("name")}
                      className="w-full py-2 px-4 rounded-md border border-blue-500 focus:outline-none"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {String(errors.name.message)}
                      </p>
                    )}
                  </div>
                 
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
                    disabled={Updating}
                    className="bg-[#36A000] text-white rounded-md px-6 py-3 hover:bg-[#36A000] focus:outline-none"
                  >
                    {Updating ? "Updating..." : "Submit"}
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
export default EditStream;
