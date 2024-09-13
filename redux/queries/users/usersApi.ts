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

        
    
  }),
});

export const {useGetUsersQuery, useCreateUserMutation, useGetAvailableTeacherUsersQuery} = usersApi;
