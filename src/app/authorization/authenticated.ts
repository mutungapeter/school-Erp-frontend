"use client";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export const useAuth = (requiredRoles: string[]) => {
  const { user, loading } = useAppSelector((state: RootState) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); 
  const router = useRouter();

  useEffect(() => {
   
    if (!loading) {
      if (user && requiredRoles.includes(user.role)) {
        setIsAuthorized(true); 
      } else {
        setIsAuthorized(false); 
        router.push('/'); 
      }
    }
  }, [loading, user, requiredRoles, router]);

  return { isAuthorized, loading }; 
};
