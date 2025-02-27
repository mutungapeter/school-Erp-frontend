import { apiSlice } from "@/redux/api/apiSlice";
interface GetSubjectsQueryArgs {
  page?: number;
  page_size?: number;
  subject_name?: string;
}
export const subjectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query({
      query: ({ page, page_size, subject_name }: GetSubjectsQueryArgs = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (subject_name) queryParams.subject_name = subject_name;

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
    createSubjectCategory: builder.mutation({
      query: (data) => ({
        url: `subject-categories/`,
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
    updateSubjectCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `subject-categories/${id}/`,
        method: "PUT",
        body: data,
      }),
    }),  
    getSubjectCategory: builder.query({
      query: (id) => ({
        url: `subject-categories/${id}/`,
        method: "GET",
      }),
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
    deleteSubjects: builder.mutation({
      query: (data) => ({
      
        url: `subjects/`,
        method: "DELETE",
        body: data
      }),
    }),   
    deleteSubjectCategories: builder.mutation({
      query: (data) => ({
      
        url: `subject-categories/`,
        method: "DELETE",
        body: data
      }),
    }),   
  }),
});

export const {
  useGetSubjectsQuery,
   useGetSubjectCategoriesQuery, 
   useUpdateSubjectCategoryMutation,
   useGetSubjectCategoryQuery,
   useCreateSubjectCategoryMutation,
   useDeleteSubjectCategoriesMutation,
   useUpdateSubjectMutation,
   useGetSubjectQuery,
   useDeleteSubjectMutation,
   useCreateSubjectMutation,
   useDeleteSubjectsMutation
   } = subjectsApi;
