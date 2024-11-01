"use client";
import { useEffect, useState } from "react";

import {
  useGetCLassLevelQuery,
  useUpdateClassLevelMutation,
} from "@/redux/queries/classes/classesApi";
import { useGetFormLevelsQuery } from "@/redux/queries/formlevels/formlevelsApi";
import { useGetStreamsQuery } from "@/redux/queries/streams/streamsApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { BiSolidEdit } from "react-icons/bi";
import { toast } from "react-toastify";
import { z } from "zod";
import Spinner from "../layouts/spinner";
import { BsChevronDown } from "react-icons/bs";
interface Props {
  classLevelId: number;
  refetchClassLevels: () => void;
}
const EditClassLevel = ({ classLevelId, refetchClassLevels }: Props) => {
  console.log("classLevelId", classLevelId);
  const [isOpen, setIsOpen] = useState(false);
  const [updateClassLevel, { isLoading: Updating }] =
    useUpdateClassLevelMutation();
  const { data: classData, isLoading: isFetching } =
    useGetCLassLevelQuery(classLevelId);
  const { data: formLevelsData, isLoading: isLoadingClasses } =
    useGetFormLevelsQuery({});
  const { data: streamsData, isLoading: isLoadingStreams } = useGetStreamsQuery(
    {}
  );

  const schema = z.object({
    form_level: z.number().min(1, "Select Form level"),
    stream: z.number().min(1, "Select stream "),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (classData) {
      setValue("form_level", classData.form_level.id);
      setValue("stream", classData?.stream?.id);
    }
  }, [classData, setValue]);
  console.log("data", classData);
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);
  const currentFormLevel = watch("form_level");
  const currentStream = watch("stream");

  const onSubmit = async (data: FieldValues) => {
    const id = classLevelId;
    try {
      await updateClassLevel({ id, ...data }).unwrap();
      toast.success("Class Level updated successfully!");
      handleCloseModal();
      refetchClassLevels();
    } catch (error: any) {
      if (error?.data?.error) {
        console.log("error", error);
        toast.error(error.data.error);
      }
    }
  };
  const handleFormLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("form_level", e.target.value);
  };
  const handleStreamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("stream", e.target.value);
  };

  return (
    <>
      <div
        className=" cursor-pointer p-1 rounded-sm bg-green-100  "
        onClick={handleOpenModal}
      >
        <BiSolidEdit size={17} className="text-green-800" />
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
              <p className="text-sm md:text-lg lg:text-lg font-semibold text-black">
                  Update Class Level details
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <div className="relative">
                  <label
                    htmlFor="form_level"
                  className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                  >
                    Form Level
                  </label>
                  <select
                    id="form_level"
                    {...register("form_level", { valueAsNumber: true })}
                    onChange={handleFormLevelChange}
                    value={watch("form_level") || ""}
                    className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                  >
                    {isLoadingClasses ? (
                      <option value="">Loading...</option>
                    ) : (
                      <>
                        <option value="">Select Class</option>
                        {formLevelsData?.map((cl: any) => (
                          <option key={cl.id} value={cl.id}>
                            {cl.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  <BsChevronDown 
                      color="gray" 
                      size={25}
                    className="absolute top-[70%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                  />
                  {errors.form_level && (
                    <p className="text-red-500 text-sm">
                      {String(errors.form_level.message)}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <label
                    htmlFor="stream"
                    className="block text-gray-900 md:text-lg text-sm lg:text-lg  font-normal  mb-2"
                  >
                    Stream
                  </label>
                  <select
                    id="stream"
                    {...register("stream", { valueAsNumber: true })}
                    onChange={handleStreamChange}
                    value={watch("stream") || "No Stream"}
                    className="w-full appearance-none py-2 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                  >
                    {isLoadingClasses ? (
                      <option value="">Loading...</option>
                    ) : (
                      <>
                        <option value="">Select Stream</option>
                        {streamsData?.map((form: any) => (
                          <option
                            key={form.id}
                            value={form.id}
                            // selected={classData?.stream?.id === form.id}
                          >
                            {form.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  <BsChevronDown 
                      color="gray" 
                      size={25}
                    className="absolute top-[70%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                  />
                  {errors.stream && (
                    <p className="text-red-500 text-sm">
                      {String(errors.stream.message)}
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
        </div>
      )}
    </>
  );
};
export default EditClassLevel;
