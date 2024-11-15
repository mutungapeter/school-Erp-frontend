
type UserRole = "Admin" | "Principal" | "Student" | "Teacher" | "OtherRole"; // Add other roles as needed

export const hasAdminPermissions = (role: UserRole | undefined): boolean => {
  return ["Admin", "Principal"].includes(role || "");
};
