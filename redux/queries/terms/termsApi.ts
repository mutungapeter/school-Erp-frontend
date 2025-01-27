import { apiSlice } from "@/redux/api/apiSlice";
interface GetStreamsInterface {
  page?: number;
  page_size?: number;
  
}
interface GetTermsInterface {
  page?: number;
  page_size?: number;
  class_level?:any;
}
export const termsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTerms: builder.query({
      query: ({ page, page_size, class_level }: GetTermsInterface = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (page_size) queryParams.page_size = page_size;
        if (class_level) queryParams.class_level = class_level;

        return {
          url: `terms/`,
          method: "GET",
          params: queryParams,
        };
      }
    }),
    createTerm: builder.mutation({
      query: (data) => ({
        url: `terms/`,
        method: "POST",
        body: data,
      }),
    }),
    getActiveTerms: builder.query({
      query: ({ page, page_size }: GetStreamsInterface = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `active-terms/`,
          method: "GET",
          params: queryParams,
        };
      }
    }),
    getUpcomingTerms: builder.query({
      query: ({ page, page_size }: GetStreamsInterface = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `active-terms/`,
          method: "GET",
          params: queryParams,
        };
      }
    }),
    getTerm: builder.query({
      query: (id: any) => ({
        url: `terms/${id}/`,
        method: "GET",
      }),
    }),
    updateTerm: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `terms/${id}/`,
        method: "PUT",
        body: data,
      }),
    }),
    updateTermStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/terms/${id}/`,
        method: "PATCH", 
        body: { status },
      }),
    }),
    deleteTerm: builder.mutation({
      query: (id) => ({
        url: `terms/${id}/`,
        method: "DELETE",
      }),
    }), 
    deleteTerms: builder.mutation({
      query: (data) => ({
      
        url: `terms/`,
        method: "DELETE",
        body: data
      }),
    }),

    
  }),
});

export const { 
  useGetTermsQuery, 
  useGetActiveTermsQuery, 
  useUpdateTermMutation,
  useDeleteTermMutation ,
  useGetTermQuery,
  useUpdateTermStatusMutation,
  useCreateTermMutation,
  useGetUpcomingTermsQuery,
  useDeleteTermsMutation
} = termsApi;
