import { apiSlice } from "@/redux/api/apiSlice";

interface PaginationArguments {
  page?: number;
  page_size?: number;
}
export const meanGradeAPi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMeanGradeConfigs: builder.query({
      query: ({ page, page_size }: PaginationArguments = {}) => {
        const queryParams: Record<string, any> = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `mean-grade-configs/`,
          method: "GET",
          params: queryParams,
        };
      }
    }),
    getMeanGradeConfig: builder.query({
      query: (id) => ({
        url: `mean-grade-configs/${id}/`,
        method: "GET",
      }),
    }), 
  
    createMeanGradeConfig: builder.mutation({
        query: (data) => ({
          url: `mean-grade-configs/`,
          method: "POST",
          body: data,
        }),
      }),
      updateMeanGradeConfig: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `mean-grade-configs/${id}/`,
        method: "PUT",
        body: data,
      }),
    }), 
      deleteMeanGradeConfig: builder.mutation({
        query: (id) => ({
          url: `mean-grade-configs/${id}/`,
          method: "DELETE",
        }),
      }),  
    
  }),
});

export const {  
  useGetMeanGradeConfigsQuery,
  useGetMeanGradeConfigQuery,
  useUpdateMeanGradeConfigMutation,
  useCreateMeanGradeConfigMutation,
  useDeleteMeanGradeConfigMutation,
} = meanGradeAPi;
