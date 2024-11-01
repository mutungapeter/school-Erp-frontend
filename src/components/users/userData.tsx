
import React from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

const UserDisplay: React.FC = () => {
  const { user, loading, error } = useAppSelector((state: RootState) => state.auth);

  if (loading) return <span className="text-primary">Loading...</span>;
  if (error) return <span className="text-primary">Error</span>;

  return user ? (
    <span className="block text-sm font-medium text-black dark:text-white uppercase">{user.first_name} {user.last_name}</span>
  ) : (
    <span className="block text-sm font-medium text-black dark:text-white uppercase">Guest</span>
  );
};

export default UserDisplay;
