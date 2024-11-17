export const getStatusColor = (status: string): { bgColor: string; textColor: string } => {
    if (status === "Active") return { bgColor: "bg-green-200", textColor: "text-green-700" };
    if (status === "Ended") return { bgColor: "bg-red-200", textColor: "text-red-700" };
    if (status === "Upcoming") return { bgColor: "bg-gray-500", textColor: "text-white" };
    
    return { bgColor: "bg-blue-500", textColor: "text-white" }; 
  };
  