"use client";
import { useAppDispatch } from "@/redux/hooks";
import DefaultLayout from "@/src/components/adminDashboard/Layouts/DefaultLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { PiLockKeyLight, PiUserCircleLight } from "react-icons/pi";
import { toast } from "react-toastify";
import { z } from "zod";

import { userLoggedOut } from "@/redux/queries/auth/authSlice";
import {
  useChangePasswordMutation,
  useGetProfileQuery,
} from "@/redux/queries/users/usersApi";
import Spinner from "@/src/components/layouts/spinner";
import Image from "next/image";
import { SlUser } from "react-icons/sl";
import PageLoadingSpinner from "@/src/components/layouts/PageLoadingSpinner";
const ProfilePage = () => {
  const { isLoading, data, refetch } = useGetProfileQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  console.log(data);

  return (
    <DefaultLayout>
      <div className=" space-y-5 shadow-md border py-2 bg-white w-full lg:max-w-3xl md:max-w-3xl  ">
        <div className="p-3  border-b items-center flex space-x-5">
          <PiUserCircleLight size={25} />
          <h2 className="font-semibold text-black md:text-xl text-md lg:text-xl">
            Profile
          </h2>
        </div>
        {isLoading ? (
            <PageLoadingSpinner />
        ):(
            <>
            <div className=" flex justify-center">
              <div className="p-3  sm:px-6 bg-light">
                <Image
                  src="/profile.png"
                  alt={data?.first_name}
                  height={50}
                  width={50}
                />
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {data?.first_name} {data?.last_name}
                  </h3>
                </div>
              </div>
            </div>
    
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0 ">
              <div className="sm:divide-y sm:divide-gray-200">
                <div className="py-1 sm:py-2  grid grid-cols-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <div className="text-sm font-medium text-gray-500">Name</div>
                  <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {data?.first_name} {data?.last_name}
                  </div>
                </div>
                <div className="py-1 sm:py-2 grid grid-cols-2  sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <div className="text-sm font-medium text-gray-500">Email</div>
                  <div className="mt-1 text-xs md:text-sm lg:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {data?.email}
                  </div>
                </div>
                <div className="py-1 sm:py-2 grid grid-cols-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <div className="text-sm font-medium text-gray-500">
                    Phone number
                  </div>
                  <div className="mt-1 text-xs md:text-sm lg:text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {data?.phone_number}
                  </div>
                </div>
              </div>
            </div>
            </>
        )}
        
       
      </div>
    </DefaultLayout>
  );
};
export default ProfilePage;
