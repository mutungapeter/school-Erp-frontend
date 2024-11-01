import { apiSlice } from "@/redux/api/apiSlice";
interface GetSubjectsQueryArgs {
  page?: number;
  page_size?: number;
}
export const subjectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query({
      query: ({ page, page_size }: GetSubjectsQueryArgs = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `subjects/`,
          method: "GET",
          params: queryParams,
        };
      }

    }),

    createSubject: builder.mutation({
      query: (data) => ({
        url: `subjects/`,
        method: "POST",
        body: data,
      }),
    }),

    getSubjectCategories: builder.query({
      query: ({ page, page_size }: GetSubjectsQueryArgs = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `subject-categories/`,
          method: "GET",
          params: queryParams,
        };
      }

    }),
    updateSubject: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `subjects/${id}/`,
        method: "PUT",
        body: data,
      }),
    }),  
    getSubject: builder.query({
      query: (id) => ({
        url: `subjects/${id}/`,
        method: "GET",
      }),
    }),  
    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `subjects/${id}/`,
        method: "DELETE",
      }),
    }),  
  }),
});

export const {useGetSubjectsQuery,
   useGetSubjectCategoriesQuery, 
   useUpdateSubjectMutation,
   useGetSubjectQuery,
   useDeleteSubjectMutation,
   useCreateSubjectMutation } = subjectsApi;
