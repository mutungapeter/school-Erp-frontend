"use client";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { useRouter } from "next/navigation";
import { userLoggedOut } from "@/redux/queries/auth/authSlice";

const SessionChecker: React.FC = () => {
  const {accessToken,  tokenExpiry } = useAppSelector((state) => state.auth);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
console.log(accessToken)
  useEffect(() => {
    const checkSession = () => {
      try {


        
        if (tokenExpiry && tokenExpiry < Date.now()) {
          dispatch(userLoggedOut());
          setShowSessionExpiredModal(true);
        }
      } catch (error) {
        console.error("Error during session check:", error);
       
      }
    };

    const intervalId = setInterval(checkSession, 1000);

    return () => clearInterval(intervalId);
  }, [tokenExpiry, dispatch]);

  const handleLoginRedirect = () => {
    setShowSessionExpiredModal(false);
    router.push("/");
  };

  return (
    <>
      {showSessionExpiredModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Session Expired</h2>
            <p className="mb-4">
              Your session has expired. Please log in again.
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleLoginRedirect}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionChecker;
