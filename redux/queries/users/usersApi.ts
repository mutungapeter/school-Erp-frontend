import { apiSlice } from "@/redux/api/apiSlice";
interface GetSubjectsQueryArgs {
  page?: number;
  page_size?: number;
}
export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page, page_size }: GetSubjectsQueryArgs = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `users/`,
          method: "GET",
          params: queryParams,
        };
      }

    }),
    getAvailableTeacherUsers: builder.query({
      query: () => {
       
        return {
          url: `teacher-users/`,
          method: "GET",
      
        };
      }

    }),


    createUser: builder.mutation({
      query: (data) => ({
        url: `users/`,
        method: "POST",
        body: data,
      }),
    }),
    getAdmin: builder.query({
      query: (id: any) => ({
        url: `users/${id}/`,
        method: "GET",
      }),
    }),
    updateAdmin: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `users/${id}/`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `users/${id}/`,
        method: "DELETE",
      }),
    }),  

        
    
  }),
});

export const {useGetUsersQuery, useDeleteAdminMutation, useCreateUserMutation, useGetAdminQuery, useUpdateAdminMutation, useGetAvailableTeacherUsersQuery} = usersApi;
